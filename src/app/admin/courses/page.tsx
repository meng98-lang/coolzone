'use client';

import { useEffect, useState } from 'react';
import {
  Clapperboard, Upload, Link2, PlayCircle, Save, Loader2, Trash2, Plus, FileUp, Copy, Check, BookOpen,
} from 'lucide-react';

interface Lesson {
  id: string;
  day: string;
  title: string;
  desc: string;
  duration: string;
  points: string[];
  video: string;
  poster: string;
  hideDuration: boolean;
}

interface Course {
  id: string;
  name: string;
  brand: string;
  lessons: Lesson[];
}

interface Catalog {
  courses: Course[];
}

const EMPTY_LESSON = (i: number): Lesson => ({
  id: `lesson_${i + 1}`,
  day: `第 ${i + 1} 节`,
  title: `课程 · 第 ${i + 1} 节`,
  desc: '',
  duration: '',
  points: [''],
  video: '',
  poster: '',
  hideDuration: true,
});

function slug(s: string): string {
  return (s || '')
    .trim()
    .replace(/[^\w-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState('');
  const [uploadState, setUploadState] = useState<Record<string, { loading: boolean; done?: boolean; error?: string }>>({});

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.courses) && d.courses.length) {
          setCourses(d.courses.map(normalizeCourse));
        } else {
          setCourses([newCourse(0, '我的后半生', '公益养生课堂')]);
        }
      })
      .catch(() => setCourses([newCourse(0, '我的后半生', '公益养生课堂')]))
      .finally(() => setLoaded(true));
  }, []);

  function normalizeCourse(c: Partial<Course>, idx: number): Course {
    return {
      id: slug((c.id as string) || '') || `course_${idx + 1}`,
      name: c.name || `课程 ${idx + 1}`,
      brand: c.brand || c.name || '公益养生课堂',
      lessons: Array.isArray(c.lessons) && c.lessons.length ? c.lessons.map((l, li) => normalizeLesson(l, li)) : [EMPTY_LESSON(0)],
    };
  }

  function normalizeLesson(l: Partial<Lesson>, i: number): Lesson {
    return {
      id: slug((l.id as string) || '') || `lesson_${i + 1}`,
      day: l.day || `第 ${i + 1} 节`,
      title: l.title || `课程 · 第 ${i + 1} 节`,
      desc: l.desc || '',
      duration: l.duration || '',
      points: Array.isArray(l.points) && l.points.length ? l.points : [''],
      video: l.video || '',
      poster: l.poster || '',
      hideDuration: l.hideDuration !== false,
    };
  }

  function newCourse(idx: number, name = '', brand = ''): Course {
    return { id: slug(name) || `course_${idx + 1}`, name: name || `新课程 ${idx + 1}`, brand: brand || name || '公益养生课堂', lessons: [EMPTY_LESSON(0)] };
  }

  function save() {
    // 过滤掉没传视频的空课
    const payload = {
      courses: courses
        .map((c) => ({ ...c, lessons: c.lessons.filter((l) => l.video.trim()) }))
        .filter((c) => c.lessons.length > 0),
    };
    if (!payload.courses.length) {
      setErr('请至少为一节课上传/填写视频');
      return;
    }
    setSaving(true);
    setErr('');
    setSaved(false);
    fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setSaved(true);
          if (Array.isArray(d.courses)) setCourses(d.courses.map(normalizeCourse));
        } else setErr(d.error || '保存失败');
      })
      .catch((e) => setErr(e.message))
      .finally(() => setSaving(false));
  }

  const course = courses[activeCourse] as Course | undefined;

  function updateCourse(patch: Partial<Course>) {
    setCourses((cs) => cs.map((c, i) => (i === activeCourse ? { ...c, ...patch } : c)));
  }

  function setLesson(i: number, patch: Partial<Lesson>) {
    if (!course) return;
    const lessons = course.lessons.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    updateCourse({ lessons });
  }

  function addLesson() {
    if (!course) return;
    const i = course.lessons.length;
    updateCourse({ lessons: [...course.lessons, EMPTY_LESSON(i)] });
  }

  function removeLesson(i: number) {
    if (!course) return;
    updateCourse({ lessons: course.lessons.filter((_, idx) => idx !== i) });
  }

  function addCourse() {
    const nc = newCourse(courses.length);
    setCourses([...courses, nc]);
    setActiveCourse(courses.length);
  }

  function removeCourse(i: number) {
    if (!confirm(`确定删除课程「${courses[i]?.name}」？仅删除配置，不会删除已上传的视频文件。`)) return;
    const next = courses.filter((_, idx) => idx !== i);
    setCourses(next.length ? next : [newCourse(0)]);
    setActiveCourse(0);
  }

  function setPoints(i: number, text: string) {
    setLesson(i, { points: text.split(/[，,、\n]/).map((s) => s.trim()) });
  }

  // 课程目录标识（上传目录 + URL c 参数），跟随课程名称，但用独立 id 输入框可控
  function courseKey() {
    return course?.id || 'course';
  }

  function playLink(c: Course, l: Lesson): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/course/watch.html?c=${encodeURIComponent(c.id)}&l=${encodeURIComponent(l.id)}`;
  }

  function copyLink(key: string, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 1600);
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0];
    if (!file || !course) return;
    const lesson = course.lessons[i];
    const courseDir = courseKey();
    const lessonId = slug(lesson.id) || `lesson_${i + 1}`;
    const key = `${course.id}:${lessonId}`;
    setUploadState((s) => ({ ...s, [key]: { loading: true } }));

    // 加载公开访问配置（SUPABASE_URL / ANON_KEY），供前端直连 Supabase Storage
    let supabaseUrl = '';
    let supabaseAnon = '';
    try {
      const envRes = await fetch('/api/env', { cache: 'no-store' });
      const envData = await envRes.json();
      supabaseUrl = envData?.supabaseUrl || '';
      supabaseAnon = envData?.supabaseAnonKey || '';
    } catch {
      /* 兜底走本地转码上传 */
    }

    try {
      // 方案B：浏览器端直传 Supabase Storage（resumable 分片，支持大视频，绕开 Vercel 4.5MB 限制）
      if (supabaseUrl && supabaseAnon && typeof window !== 'undefined') {
        const mod = await import('@supabase/supabase-js');
        const sb = mod.createClient(supabaseUrl, supabaseAnon, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^\w]/g, '');
        const safeExt = ext === 'mp4' ? 'mp4' : 'mp4'; // 统一转 mp4（浏览器端不转码，直接存原文件，播放兼容交给 hls/mp4 播放器）
        const objectName = `${courseDir}/${lessonId}.${safeExt}`;
        const { data, error } = await sb.storage
          .from('course-media')
          .upload(objectName, file, {
            cacheControl: '3600',
            contentType: 'video/mp4',
            upsert: true, // 覆盖式，重传同节视频直接替换
            duplex: 'half',
          });
        if (error) throw new Error(error.message || '上传到对象存储失败');
        const url = `${supabaseUrl}/storage/v1/object/public/course-media/${data?.path || objectName}`;
        setLesson(i, { video: url, id: lessonId });
        setUploadState((s) => ({ ...s, [key]: { loading: false, done: true } }));
        setErr('');
      } else {
        // 兜底A：Vercel 受限环境的本地转码上传（小文件可用）
        const fd = new FormData();
        fd.append('video', file);
        fd.append('course', courseDir);
        fd.append('lessonId', lessonId);
        const res = await fetch('/api/course-video-upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || '上传失败');
        setLesson(i, { video: data.url, id: lessonId });
        setUploadState((s) => ({ ...s, [key]: { loading: false, done: true } }));
        setErr('');
      }
    } catch (eu) {
      setUploadState((s) => ({ ...s, [key]: { loading: false, error: eu instanceof Error ? eu.message : '上传失败' } }));
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  if (!loaded) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> 加载课程配置…
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Clapperboard className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">课程发布管理</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        新建课程 → 上传视频 → 点保存 → 直接复制每节课链接发给客户，全程无需技术介入。链接自带防快进 / 禁倍速 / 隐藏时长。
      </p>

      {/* 课程切换标签 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {courses.map((c, i) => (
          <button
            key={`${c.id}-${i}`}
            onClick={() => setActiveCourse(i)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
              i === activeCourse ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> {c.name}
            <span
              role="button"
              tabIndex={0}
              onClick={(ev) => { ev.stopPropagation(); removeCourse(i); }}
              className="ml-0.5 opacity-60 hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
        <button onClick={addCourse} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50">
          <Plus className="w-4 h-4" /> 新建课程
        </button>
      </div>

      {course && (
        <>
          {/* 课程信息 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程名称</label>
                <input
                  value={course.name}
                  onChange={(e) => updateCourse({ name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="如：太极课"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程标识 id（用于链接，英文/拼音）</label>
                <input
                  value={course.id}
                  onChange={(e) => updateCourse({ id: slug(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-xs"
                  placeholder="如 taiji"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品牌 / 课堂名</label>
                <input
                  value={course.brand}
                  onChange={(e) => updateCourse({ brand: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="如：公益养生课堂"
                />
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">课程主页链接（全部课时）</span>
              <button
                onClick={() => copyLink(`home-${course.id}`, `${window.location.origin}/course/index.html`)}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                {copied === `home-${course.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} 复制主页链接
              </button>
            </div>
          </div>

          {/* 课时列表 */}
          <div className="mt-6 space-y-4">
            {course.lessons.map((l, i) => {
              const key = `${course.id}:${l.id}`;
              const hasVideo = !!l.video.trim();
              return (
                <div key={`${l.id}-${i}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-blue-500" /> {l.day} · {l.title || '（未命名）'}
                    </h3>
                    <button onClick={() => removeLesson(i)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">节标题</label>
                      <input value={l.title} onChange={(e) => setLesson(i, { title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">小节标签 day</label>
                      <input value={l.day} onChange={(e) => setLesson(i, { day: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="第 1 节 / DAY 1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">节次 id（链接用）</label>
                      <input value={l.id} onChange={(e) => setLesson(i, { id: slug(e.target.value) })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-xs" placeholder="如 day1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                      <input value={l.desc} onChange={(e) => setLesson(i, { desc: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="一句话简介（可留空）" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">本节要点（逗号分隔）</label>
                      <input value={(l.points || []).join('，')} onChange={(e) => setPoints(i, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="要点一，要点二" />
                    </div>
                  </div>

                  {/* 视频上传 */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => document.getElementById(`vf-${course.id}-${i}`)?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-medium text-sm"
                      >
                        <FileUp className="w-4 h-4" /> 选择视频文件上传
                      </button>
                      <input id={`vf-${course.id}-${i}`} type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e, i)} />
                      {uploadState[key]?.loading && (
                        <span className="inline-flex items-center gap-2 text-sm text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" /> 上传并转码中，请稍候…
                        </span>
                      )}
                      {uploadState[key]?.done && <span className="text-sm text-green-600">✓ 已上传</span>}
                      {uploadState[key]?.error && <span className="text-sm text-red-500">{uploadState[key].error}</span>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">视频直链（上传后自动填入，也可手动填外部直链）</label>
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
                        <input value={l.video} onChange={(e) => setLesson(i, { video: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" placeholder="/course/videos/taiji/day1.mp4 或 https://…/index.m3u8" />
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600 select-none">
                      <input type="checkbox" checked={l.hideDuration} onChange={(e) => setLesson(i, { hideDuration: e.target.checked })} className="rounded border-gray-300" />
                      隐藏视频总时长（学员看不到片长）
                    </label>
                  </div>

                  {/* 播放链接 */}
                  {hasVideo && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-green-700 font-medium shrink-0">客户观看链接（保存后生效）</span>
                      <code className="flex-1 text-[11px] text-green-800 bg-white/70 px-2 py-1 rounded break-all">{playLink(course, l)}</code>
                      <button
                        onClick={() => copyLink(`link-${key}`, playLink(course, l))}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 shrink-0"
                      >
                        {copied === `link-${key}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === `link-${key}` ? '已复制' : '复制链接'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={addLesson} className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-500 rounded-2xl py-3 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> 添加一节课
            </button>
          </div>

          {/* 保存 */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 保存并发布
            </button>
            {saved && <span className="text-green-600 text-sm">✓ 已保存，链接即时生效，可直接发给客户</span>}
            {err && <span className="text-red-500 text-sm">{err}</span>}
          </div>

          <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm text-gray-600 space-y-2">
            <p className="font-medium flex items-center gap-2"><Upload className="w-4 h-4 text-blue-500" /> 使用流程</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500">
              <li>点「新建课程」，填课程名称（如 太极课）和课程标识（如 taiji）。</li>
              <li>每节课点「选择视频文件上传」，等转码完成（单视频最大 2GB）。</li>
              <li>填好标题/要点，勾选是否隐藏时长。</li>
              <li>点「保存并发布」→ 复制该节课的观看链接发给客户。</li>
            </ol>
            <p className="text-xs text-gray-400 mt-2">播放器已内置：禁止快进拖动、锁定 1.0 倍速、可隐藏总时长。视频存站内相对路径，更换域名后链接路径不变。</p>
          </div>
        </>
      )}
    </div>
  );
}
