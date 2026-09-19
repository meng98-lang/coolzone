import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { S3Storage } from "coze-coding-dev-sdk";

function getStorage() {
  return new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: "",
    secretKey: "",
    bucketName: process.env.COZE_BUCKET_NAME,
    region: "cn-beijing",
  });
}

/**
 * 课程数据字典（多课程），持久化到对象存储 courses/catalog.json。
 * 结构：{ version: 2, courses: Course[] }
 * 兼容旧结构：{ siteName, brand, lessons } -> 视为单课程。
 */
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
  version: 2;
  courses: Course[];
}

/** 默认课程：后台尚未保存任何内容时的兜底，保证前台始终可播。 */
const DEFAULT_CATALOG: CatalogV2 = {
  version: 2,
  courses: [
    {
      id: "hbs",
      name: "我的后半生",
      brand: "公益养生课堂",
      lessons: [
        {
          id: "day1",
          day: "DAY 1",
          title: "我的后半生 · 第1节",
          desc: "更新于 2026-09-17",
          duration: "约 60 分钟",
          points: ["重新认识自己", "学会爱与被爱", "找到人生下半场的节奏"],
          video:
            "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson1/index.m3u8",
          hideDuration: false,
        },
        {
          id: "day2",
          day: "DAY 2",
          title: "我的后半生 · 第2节",
          desc: "",
          duration: "约 60 分钟",
          points: ["与情绪和解", "亲密关系的经营", "让内心安定下来"],
          video:
            "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson2/index.m3u8",
          hideDuration: false,
        },
        {
          id: "day3",
          day: "DAY 3",
          title: "我的后半生 · 第3节",
          desc: "",
          duration: "约 60 分钟",
          points: ["健康生活方式", "找到兴趣与热爱", "开启幸福后半生"],
          video:
            "https://ysqfpsbfbscyqzqhdfsa.supabase.co/storage/v1/object/public/course-media/lesson3/index.m3u8",
          hideDuration: false,
        },
      ],
    },
  ],
};

/** 规范化任意输入为 v2 多课程结构。 */
function normalize(raw: unknown): CatalogV2 {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    // v2 多课程
    if (Array.isArray(r.courses)) {
      return { version: 2, courses: r.courses as Course[] };
    }
    // 旧版单课程
    if (Array.isArray(r.lessons) && typeof r.siteName === "string") {
      return {
        version: 2,
        courses: [
          {
            id: "hbs",
            name: r.siteName as string,
            brand: (r.brand as string) || r.siteName,
            lessons: r.lessons as Lesson[],
          },
        ],
      };
    }
  }
  return DEFAULT_CATALOG;
}

export async function GET() {
  try {
    const storage = getStorage();
    // uploadFile 会生成带随机后缀的 key，这里列出 courses/ 下所有 catalog 文件，取最新一份
    const listed = await storage.listFiles({ prefix: "courses/", maxKeys: 200 });
    const keys: string[] = ((listed as { keys?: string[] }).keys || [])
      .filter((k) => /courses\/catalog[^/]*\.json$/.test(k));

    if (!keys.length) {
      return NextResponse.json({ ok: true, ...DEFAULT_CATALOG });
    }
    // 文件名带时间戳后缀，字典序最大者即最新
    keys.sort();
    const latestKey = keys[keys.length - 1];
    const buf = await storage.readFile({ fileKey: latestKey });
    const data = JSON.parse(buf.toString("utf8"));
    const catalog = normalize(data);
    if (!catalog.courses || catalog.courses.length === 0) {
      return NextResponse.json({ ok: true, ...DEFAULT_CATALOG });
    }
    return NextResponse.json({ ok: true, ...catalog });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg, ...DEFAULT_CATALOG }, { status: 200 });
  }
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

    const storage = getStorage();
    const payload: CatalogV2 = { version: 2, courses: clean };

    // 删除旧的 catalog 文件，保证 list 出来的只有本次这一份（最新）
    try {
      const old = await storage.listFiles({ prefix: "courses/", maxKeys: 200 });
      const oldKeys = ((old as { keys?: string[] }).keys || []).filter((k) =>
        /courses\/catalog[^/]*\.json$/.test(k),
      );
      await Promise.all(oldKeys.map((k) => storage.deleteFile({ fileKey: k }).catch(() => false)));
    } catch {
      /* 清理失败不阻塞保存 */
    }

    const key = await storage.uploadFile({
      fileContent: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),
      fileName: CONFIG_KEY,
      contentType: "application/json",
    });
    return NextResponse.json({ ok: true, key, courses: clean });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function slug(s: unknown): string {
  return String(s || "")
    .trim()
    .replace(/[^\w-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
