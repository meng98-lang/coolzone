import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// 课程视频持久化根目录（静态资源，长期稳定可播放）
// 每个课程一个子目录，如 public/course/videos/<courseKey>/<lessonId>.mp4
function publicDir() {
  const root = process.env.COZE_WORKSPACE_PATH || "/workspace/projects";
  return path.join(root, "public", "course", "videos");
}

// 安全化文件名（仅保留字母数字 - _ .）
function safeName(s: string) {
  return (s || "video").replace(/[^\w.\-]+/g, "_").slice(0, 80);
}

// 安全化课程/节次标识
function safeKey(s: string) {
  return (s || "lesson").replace(/[^\w\-]+/g, "_").slice(0, 60);
}

/**
 * POST /api/course-video-upload
 * 接收多部分表单：video 文件 + course(课程标识) + lessonId(节次标识)
 * 服务端用 ffmpeg 转码为 MP4 存入公共目录，返回稳定直链。
 */
export async function POST(req: NextRequest) {
  let uploaded: Buffer | null = null;
  let fileName = "";
  let course = "lesson";
  let lessonId = "lesson1";

  try {
    // 兼容两种提交方式：multipart 表单 或 原生 body(application/octet-stream)
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("video");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const f = file as unknown as { name?: string; arrayBuffer(): Promise<ArrayBuffer> };
        fileName = safeName(f.name || "video.mp4");
        uploaded = Buffer.from(await f.arrayBuffer());
      }
      const c = form.get("course");
      const l = form.get("lessonId");
      if (c) course = safeKey(String(c));
      if (l) lessonId = safeKey(String(l));
    } else {
      const arr = new URL(req.url);
      fileName = safeName(arr.searchParams.get("name") || "video.mp4");
      course = safeKey(arr.searchParams.get("course") || course);
      lessonId = safeKey(arr.searchParams.get("lessonId") || lessonId);
      uploaded = Buffer.from(await req.arrayBuffer());
    }

    if (!uploaded || uploaded.length === 0) {
      return NextResponse.json({ ok: false, error: "empty_file" }, { status: 400 });
    }
    // 限制单视频 2GB
    if (uploaded.length > 2 * 1024 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
    }

    const root = publicDir();
    const courseDir = path.join(root, course);
    fs.mkdirSync(courseDir, { recursive: true });

    const ext = path.extname(fileName).toLowerCase();
    const inName = `in${ext || ".mp4"}`;
    const inPath = path.join(courseDir, inName);
    const outName = `${lessonId}.mp4`;
    const outPath = path.join(courseDir, outName);
    fs.writeFileSync(inPath, uploaded);

    // ffmpeg 转码为 H.264 + AAC MP4（手机/浏览器通用），faststart 利于渐进播放
    await transcode(inPath, outPath);

    // 清理临时输入及历史残留（in.* 均可删）
    try {
      fs.readdirSync(courseDir)
        .filter((f) => /^in\.[A-Za-z0-9]+$/.test(f))
        .forEach((f) => { try { fs.unlinkSync(path.join(courseDir, f)); } catch { /* ignore */ } });
    } catch { /* ignore */ }

    return NextResponse.json({
      ok: true,
      lessonId,
      url: `/course/videos/${course}/${outName}`,
      size: fs.statSync(outPath).size,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// DELETE /api/course-video-upload?course=xx&lessonId=yy —— 删除某节课视频
export async function DELETE(req: NextRequest) {
  try {
    const course = safeKey(req.nextUrl.searchParams.get("course") || "lesson");
    const lessonId = safeKey(req.nextUrl.searchParams.get("lessonId") || "lesson1");
    const p = path.join(publicDir(), course, `${lessonId}.mp4`);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, skipped: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// GET /api/course-video-upload —— 列出某课程已上传的视频
export async function GET(req: NextRequest) {
  try {
    const course = safeKey(req.nextUrl.searchParams.get("course") || "lesson");
    const root = path.join(publicDir(), course);
    if (!fs.existsSync(root)) return NextResponse.json({ ok: true, files: [] });
    const files = fs.readdirSync(root)
      .filter((f) => f.endsWith(".mp4"))
      .map((f) => Promise.resolve(f));
    const list = await Promise.all(files);
    return NextResponse.json({
      ok: true,
      files: list.map((f) => ({
        lessonId: f.replace(/\.mp4$/i, ""),
        url: `/course/videos/${course}/${f}`,
      })),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function transcode(src: string, dst: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i", src,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "23",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
      // 限制转码占用，避免打满 CPU/内存把沙箱实例拖垮。0=自动，这里取核心数一半，留足余量
      "-threads", String(Math.max(1, Math.floor((require("os").cpus()?.length || 4) / 2))),
      dst,
    ];
    const proc = spawn("ffmpeg", args, { stdio: "pipe" });
    let errLog = "";
    proc.stderr?.on("data", (d) => { errLog += String(d); });
    proc.on("error", (e) => reject(e));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code}: ${errLog.slice(-500)}`));
    });
  });
}