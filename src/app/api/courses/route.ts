import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { S3Storage } from "coze-coding-dev-sdk";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// ============================================================
// 课程数据存储（多课程 catalog v2）
//
// 【主存储】Supabase course_catalog 表 —— Vercel 上可读写（真持久化）
// 【兜底】对象存储 courses/catalog*.json —— 仅当表不可用时读取
// ============================================================

function getStorage() {
  return new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: "",
    secretKey: "",
    bucketName: process.env.COZE_BUCKET_NAME,
    region: "cn-beijing",
  });
}

const CONFIG_KEY = "courses/catalog.json";

export interface Lesson {
  id: string;
  day?: string;
  title: string;
  desc?: string;
  duration?: string;
  points?: string[];
  video: string;
  poster?: string;
  hideDuration?: boolean;
}

export interface Course {
  id: string;
  name: string;
  brand?: string;
  lessons: Lesson[];
}

interface CatalogV2 {
  version: number;
  courses: Course[];
}

/** 默认课程：后台尚未保存任何内容时的兜底，保证前台始终可播。 */
const DEFAULT_CATALOG: CatalogV2 = {
  version: 2,
  courses: [
    {
      id: "yijing",
      name: "易经课程",
      brand: "易经课堂",
      lessons: [{ id: "yijing", day: "正课", title: "易经 · 完整课程", desc: "《易经》系统课程，手机直接观看。", duration: "完整课程", points: ["易经基础", "卦象解读", "实践运用"], video: "/yijing/yijing.mp4", poster: "", hideDuration: false }],
    },
    {
      id: "hbs",
      name: "我的后半生",
      brand: "公益养生课堂",
      lessons: [
        { id: "day1", day: "DAY 1", title: "我的后半生 · 第1节", desc: "更新于 2026-09-17", duration: "约 60 分钟", points: ["重新认识自己", "学会爱与被爱", "找到人生下半场的节奏"], video: "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson1/index.m3u8", poster: "", hideDuration: false },
        { id: "day2", day: "DAY 2", title: "我的后半生 · 第2节", desc: "", duration: "约 60 分钟", points: ["与情绪和解", "亲密关系的经营", "让内心安定下来"], video: "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson2/index.m3u8", poster: "", hideDuration: false },
        { id: "day3", day: "DAY 3", title: "我的后半生 · 第3节", desc: "", duration: "约 60 分钟", points: ["健康生活方式", "找到兴趣与热爱", "开启幸福后半生"], video: "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson3/index.m3u8", poster: "", hideDuration: false },
      ],
    },
  ],
};

// ========== Supabase 持久化 ==========
const CATALOG_ROW_ID = "main";
const COURSE_TABLE = "course_catalog";

async function readFromDb(): Promise<CatalogV2 | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .from(COURSE_TABLE)
      .select("data")
      .eq("id", CATALOG_ROW_ID)
      .maybeSingle();
    if (error || !data) return null;
    const c = data.data as { courses?: Course[]; version?: number };
    if (!c || !Array.isArray(c.courses) || c.courses.length === 0) return null;
    return normalize(c as CatalogV2 & { version?: number });
  } catch {
    return null;
  }
}

async function writeToDb(catalog: CatalogV2): Promise<boolean> {
  try {
    const { error } = await getSupabaseClient()
      .from(COURSE_TABLE)
      .upsert({ id: CATALOG_ROW_ID, data: catalog, updated_at: new Date().toISOString() });
    if (error) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  // 1) 主：Supabase 表
  try {
    const fromDb = await readFromDb();
    if (fromDb) {
      return NextResponse.json({ ok: true, ...fromDb });
    }
  } catch {
    /* fall through */
  }

  // 2) 兜底：对象存储 catalog
  try {
    const storage = getStorage();
    const listed = await storage.listFiles({ prefix: "courses/", maxKeys: 200 });
    const keys: string[] = ((listed as { keys?: string[] }).keys || []).filter((k) =>
      /courses\/catalog[^/]*\.json$/.test(k),
    );
    if (keys.length) {
      keys.sort();
      const buf = await storage.readFile({ fileKey: keys[keys.length - 1] });
      const catalog = normalize(JSON.parse(buf.toString("utf8")));
      if (catalog.courses?.length) {
        return NextResponse.json({ ok: true, ...catalog });
      }
    }
  } catch {
    /* fall through */
  }

  // 3) 最终兜底：默认课程
  return NextResponse.json({ ok: true, ...DEFAULT_CATALOG });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const courses = (body as { courses?: unknown })?.courses;
    if (!Array.isArray(courses)) {
      return NextResponse.json({ ok: false, error: "bad_catalog: courses[] required" }, { status: 400 });
    }

    // 清洗与校验
    const clean: Course[] = [];
    courses.forEach((c, ci) => {
      const course = c as Partial<Course>;
      if (!Array.isArray(course.lessons)) return;
      const id = slug(course.id) || `course_${ci + 1}`;
      const name = (course.name || `课程 ${ci + 1}`).toString();
      clean.push({
        id,
        name,
        brand: (course.brand || name).toString(),
        lessons: course.lessons
          .filter((l): l is Lesson => !!l && typeof l === "object" && typeof (l as Lesson).video === "string")
          .map((l, li) => ({
            id: slug(l.id) || `lesson_${li + 1}`,
            day: l.day || `第 ${li + 1} 节`,
            title: l.title || `${name} · 第${li + 1}节`,
            desc: l.desc || "",
            duration: l.duration || "",
            points: Array.isArray(l.points) ? l.points : [],
            video: l.video,
            poster: l.poster || "",
            hideDuration: !!l.hideDuration,
          })),
      });
    });

    if (clean.length === 0) {
      return NextResponse.json({ ok: false, error: "至少需要一门课程且每门课至少一节课" }, { status: 400 });
    }

    const payload: CatalogV2 = { version: 2, courses: clean };

    // 主：写 Supabase 表（Vercel 可用）
    const dbOk = await writeToDb(payload);

    // 兜底：同步到对象存储（可选，尽力而为）
    let ossKey: string | null = null;
    try {
      const storage = getStorage();
      const old = await storage.listFiles({ prefix: "courses/", maxKeys: 200 });
      const oldKeys = ((old as { keys?: string[] }).keys || []).filter((k) =>
        /courses\/catalog[^/]*\.json$/.test(k),
      );
      await Promise.all(oldKeys.map((k) => storage.deleteFile({ fileKey: k }).catch(() => false)));
      ossKey = await storage.uploadFile({
        fileContent: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),
        fileName: CONFIG_KEY,
        contentType: "application/json",
      });
    } catch {
      ossKey = null; /* 对象存储兜底失败不影响主流程 */
    }

    if (!dbOk && !ossKey) {
      return NextResponse.json({ ok: false, error: "保存失败：既无法写入数据库也无法写入对象存储" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, dbSaved: dbOk, ossKey, courses: clean });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function normalize(data: unknown): CatalogV2 {
  const d = (data || {}) as Partial<CatalogV2> & { lessons?: Lesson[]; siteName?: string; brand?: string };

  // 旧单课程结构：{ siteName, brand, lessons }
  if (Array.isArray(d.lessons) && !Array.isArray(d.courses)) {
    return {
      version: 2,
      courses: [
        {
          id: slug(d.siteName || "course") || "course",
          name: String(d.siteName || "课程"),
          brand: String(d.brand || d.siteName || "课程"),
          lessons: d.lessons,
        },
      ],
    };
  }

  return {
    version: 2,
    courses: Array.isArray(d.courses) ? d.courses : DEFAULT_CATALOG.courses,
  };
}

function slug(s: unknown): string {
  return String(s || "")
    .trim()
    .replace(/[^\w-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}