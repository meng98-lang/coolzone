import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

// 服务器本地暂存根目录（绕开 Supabase 单次 PUT 大小限制）
const ROOT = "/tmp/yijing_upload";

// 允许的路径：<课程前缀>/<sanitized dir>/<5 位分片序号>
// 三个捕获组，支持任意课程（如 taiji/、yijing/、course_xxx/）
const PART_RE = /^([A-Za-z0-9_\-]+)\/([A-Za-z0-9_\-]+)\/([0-9]{5})$/;
const NAME_RE = /^[A-Za-z0-9_\-]+$/;

function safeJoin(...seg: string[]): string {
  const p = path.join(...seg);
  if (!p.startsWith(ROOT)) throw new Error("bad path");
  return p;
}

// 写入单个分片
export async function PUT(req: NextRequest) {
  const rel = req.nextUrl.searchParams.get("path") || "";
  const m = rel.match(PART_RE);
  if (!m) {
    return NextResponse.json({ ok: false, error: "bad_path" }, { status: 400 });
  }
  // 三段结构：<课程前缀>/<目录名>/<分片号>。历史 yijing 两段写法也兼容。
  const course = m[1];
  const dir = m[2];
  const part = m[3];
  const blob = await req.blob();
  if (!blob || blob.size === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }
  const buf = Buffer.from(await blob.arrayBuffer());
  // 按课程前缀分子目录，便于多课程隔离与后续合并
  const dirPath = safeJoin(ROOT, course, dir);
  const filePath = safeJoin(dirPath, part);
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    // 若已存在且长度>=当前，视为已完成（断点续传跳片）
    if (fs.existsSync(filePath)) {
      const st = fs.statSync(filePath);
      if (st.size >= buf.length) {
        return NextResponse.json({ ok: true, skipped: st.size });
      }
    }
    fs.writeFileSync(filePath, buf);
    return NextResponse.json({ ok: true, written: buf.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "exception", detail: msg }, { status: 500 });
  }
}

// 查询：<course>/<dir> 下已有哪些分片
export async function GET(req: NextRequest) {
  const course = req.nextUrl.searchParams.get("course") || "";
  const dir = req.nextUrl.searchParams.get("dir") || "";
  if (!NAME_RE.test(course) || !NAME_RE.test(dir)) {
    return NextResponse.json({ ok: false, error: "bad_dir" }, { status: 400 });
  }
  const dirPath = safeJoin(ROOT, course, dir);
  try {
    if (!fs.existsSync(dirPath)) return NextResponse.json({ ok: true, parts: [], total: 0 });
    const parts = fs.readdirSync(dirPath)
      .filter((f) => /^[0-9]{5}$/.test(f))
      .map((f) => ({ part: f, size: fs.statSync(safeJoin(dirPath, f)).size }))
      .sort((a, b) => a.part.localeCompare(b.part));
    return NextResponse.json({ ok: true, parts });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "exception", detail: msg }, { status: 500 });
  }
}