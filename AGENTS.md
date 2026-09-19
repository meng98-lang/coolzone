# CoolZone - 空调独立电商站

## 项目概览
面向欧洲市场的空调产品独立电商网站。基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui 构建。支持24种欧盟语言的多语言SEO。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **i18n**: 自定义多语言方案（24种EU语言）

## 文件结构
```
src/
├── i18n/
│   ├── config.ts               # 语言配置（24种EU语言、默认语言、语言名称/旗帜）
│   ├── translations.ts         # 翻译字典（en/fr/de/es/it/nl/pt/pl 完整翻译）
│   └── language-context.tsx    # 语言上下文Provider（useTranslation hook）
├── middleware.ts               # 语言检测与重定向中间件
├── app/
│   ├── layout.tsx              # 根布局（最小化，传递给[locale]）
│   ├── page.tsx                # 根页面（重定向到/en）
│   ├── globals.css             # 全局样式
│   ├── [locale]/
│   │   ├── layout.tsx          # 多语言布局（LanguageProvider、Header、Footer等）
│   │   ├── page.tsx            # 首页（翻译内容、JSON-LD、hreflang）
│   │   ├── products/
│   │   │   ├── page.tsx        # 产品列表页（分类筛选、翻译）
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 产品详情页（翻译metadata、hreflang）
│   │   ├── contact/
│   │   │   └── page.tsx        # 联系表单页（翻译）
│   │   ├── checkout/
│   │   │   └── page.tsx        # 订单摘要页（翻译）
│   │   └── ok/
│   │       └── page.tsx        # 感谢页面（翻译、谷歌广告转化）
│   ├── products/
│   │   └── [slug]/
│   │       └── product-detail.tsx  # 产品详情客户端组件
│   ├── admin/                  # 后台管理（不本地化）
│   ├── api/                    # API路由（不本地化）
│   ├── sitemap.ts              # 多语言Sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── header.tsx              # 顶部导航（含语言切换器）
│   ├── footer.tsx              # 页脚（翻译链接）
│   ├── product-card.tsx        # 产品卡片（locale感知链接）
│   ├── language-switcher.tsx   # 语言切换器下拉组件
│   ├── contact-form.tsx        # 联系表单（翻译标签）
│   ├── cart-sidebar.tsx        # 购物车侧边栏
│   ├── whatsapp-float.tsx      # 悬浮WhatsApp按钮
│   ├── tracking-scripts.tsx    # FB像素+GA跟踪代码
│   └── traffic-tracker.tsx     # 流量追踪组件
└── lib/
    ├── products.ts             # 产品数据
    ├── store.tsx               # 购物车状态管理
    ├── whatsapp.ts             # WhatsApp配置
    ├── db.ts                   # 数据存储（JSON文件）
    └── utils.ts                # 工具函数
```

## 多语言SEO
- **支持语言**: 24种欧盟官方语言（en, fr, de, es, it, nl, pt, pl, sv, da, fi, cs, ro, hu, el, bg, hr, sk, sl, lt, lv, et, mt, ga）
- **完整翻译**: 英语、法语、德语、西班牙语、意大利语、荷兰语、葡萄牙语、波兰语
- **路由结构**: `/[locale]/page` 格式（如 `/fr/products`、`/de/contact`）
- **自动检测**: 中间件根据浏览器 Accept-Language 自动重定向
- **hreflang标签**: 每个页面自动生成所有语言版本的alternates
- **多语言Sitemap**: 为每种语言生成独立的URL条目，含alternates
- **语言切换器**: Header中的下拉组件，支持所有24种语言
- **SEO Metadata**: 每个页面根据语言生成对应的title、description、Open Graph

## 核心功能
1. **首页**: Hero区域、品牌特性、全部产品、数据统计、联系表单
2. **产品列表**: 按分类筛选、产品网格
3. **产品详情**: 图片画廊、规格参数、WhatsApp购买/加购、相关推荐
4. **购物车**: 侧边栏、数量调整、WhatsApp下单
5. **WhatsApp集成**: 悬浮按钮、产品咨询、订单跳转
6. **联系表单**: 客户留言，提交后跳转到 /ok
7. **后台管理**: /admin 登录查看表单、配置FB/GA/WhatsApp
8. **多语言**: 24种EU语言自动检测与切换

## 后台管理
- **访问地址**: /admin
- **默认密码**: coolzone2024

## 数据存储（Supabase 数据库，非 JSON 文件）
- 数据存于 Supabase（`COZE_SUPABASE_URL`/`COZE_SUPABASE_ANON_KEY`），`src/lib/db.ts` 封装。
- **settings 表为扁平单行结构**：`whatsapp_phone / facebook_pixel_id / google_analytics_id / tiktok_pixel_id / admin_password / updated_at`（id=1）。⚠️ 勿改成 key-value 结构，会报 `column settings.key does not exist`。
- **RLS 已关闭**（traffic/inquiries 需匿名写入，RLS 会拦截导致 500）。
- `inquiries` 表：联系表单；`traffic` 表：流量统计。
- API：`/api/settings`（登录+配置）、`/api/contact`（表单）、`/api/traffic`（流量）。

## 标准课程模板（公益课程发布 - 标准化流程）
> 目标：所有课程都用同一套「稳定版」模板，杜绝播放失败与数据丢失。

### 为什么这套模板从不出错
- **纯静态播放页**（无动态后端依赖，零故障）+ **本地打包 hls.min.js**（不依赖外网 CDN）。
- **视频存对象存储**（如 Supabase `course-media` bucket，HLS index.m3u8，持久化）——**严禁放服务器临时目录 `/tmp`**（会被清理导致内容丢失）。

### 多课程数据模型 v2（方案B，后台自助发布）
- catalog 结构：`{version:2, courses:[{id,name,brand,lessons:[{id,day,title,desc,duration,points[],video,poster,hideDuration}]}]}`。
- **播放链接格式**：`/course/watch.html?c=<courseId>&l=<lessonId>`；兼容旧 `/course/watch.html?id=<lessonId>`（`js/loader.js` 的 resolveLesson 同时解析 `c/l` 与旧 `id`）。
- `public/course/js/loader.js`：`window.CourseStore`，列表页/播放页统一先 `fetch('/api/courses')`（no-store），失败自动回退静态 `config.js`，故纯静态部署（无 API）也能跑。
- 后台 `/admin/courses`：课程标签切换 / 新建 / 删除；每节课支持「选择视频文件上传」、填视频直链、勾选 hideDuration；每节课旁有绿色「复制链接」条（`navigator.clipboard`，拼 origin+`/course/watch.html?c=&l=`）。**保存即生效，无需开发者介入。**
- 本地上传走 `/api/course-video-upload`（multipart，ffmpeg 转码 libx264/aac + faststart），视频落 `public/course/videos/<course>/<lesson>.mp4`（相对路径，支持 206 Range 渐进播放，单文件≤2GB）；对象存储 HLS 直链也可直接填进「视频直链」。

### 文件
- `course-template/src/` – 标准模板源（与 public/course 播放端保持同步）：`index.html`(列表) / `watch.html`(播放页) / `config.js`(静态兜底课程配置) / `js/loader.js`(多课程加载器) / `js/player.js`(防快进/禁倍速/可隐时长播放器) / `js/app.js`(多课程分组渲染) / `styles/main.css` / `vendor/hls.min.js`(本地)。
- `public/course/` – 线上课程站。播放：`/course/index.html`；单节：`/course/watch.html?c=hbs&l=day1`（新）或 `?id=day1`（旧）。
- `src/app/api/courses/route.ts` – catalog 读写，存对象存储 `courses/catalog*.json`。
  - ⚠️ **S3Storage.uploadFile 的 key 带随机后缀**（catalog_xxxx.json），GET 不能读固定 key：用 `listFiles({prefix:'courses/'})` → 过滤 `courses/catalog[^/]*\.json` → 排序取最新；PUT 时先删全部旧 catalog 再上传，保证只剩一份。
  - ⚠️ `listFiles()` 返回 `{keys:string[],...}`（字段是 `keys` 不是 `files`）。
- `src/app/api/course-video-upload/route.ts` – 视频上传/列出/删除（ffmpeg 转码）。
- `src/app/admin/courses/page.tsx` – 后台「课程发布」多课程编辑页。

### 发布流程（后台自助，方案B）
1. 登录 `/admin`（密码 coolzone2024）→ 左侧「课程发布」。
2. 新建课程标签（课程名 + 课程id，如 `taiji`，id 会做 slug 清洗）。
3. 每节课：点「选择视频文件上传」自动转码回填，**或**在「视频直链」填对象存储 HLS（`.../index.m3u8`）；按需勾选「隐藏视频总时长」。
4. 点保存（PUT /api/courses 持久化到对象存储）。前台 `/course` 与每节课链接立即生效。
5. 点每节课旁「复制链接」发给客户，格式 `watch.html?c=<课程id>&l=<节id>`。
- **关键约定**：视频一律持久化（对象存储或 `public/course/videos/`），严禁只放 `/tmp`；`config.js` 是 API 不可用时的静态兜底。
- **catalog 主存储（已迁移）**：`/api/courses` 主存 Supabase `course_catalog` 表（行 id='main', `data jsonb`，RLS 已 DISABLE 并 GRANT anon 读写），对象存储 catalog*.json 与内置 DEFAULT_CATALOG 依次兜底；PUT 先写表（dbSaved），尽力同步 OSS。

### 大视频发布（路径一：沙箱分片上传 → 转码进静态包，绕开 50MB 上限）
> 背景：正式部署在 Vercel，函数请求体上限 4.5MB、文件系统只读；Supabase 托管 free 单对象硬上限 **50MB**。超过 50MB 的课程视频无法用后台直传，统一走本路径。
- **上传页**：`public/upload-course.html`（路由 `/upload-course.html`）。填「课程标识」（英文/拼音 slug）→ 选视频（每个一节）→ 填节次id（day1…）与节标题 → 开始。6MB 分片、6 路并发、单文件上限 8GB、localStorage 断点续传。
- **分片接口**：`src/app/api/upload-chunk/route.ts`，`PUT ?path=<course>/<base>/NNNNN` 落盘 `/tmp/yijing_upload/<course>/<base>/NNNNN`（已存在等长则跳过）；`GET ?course=&dir=` 列已有分片。**仅开发沙箱可写**（Vercel 只读盘），所以上传动作必须在沙箱预览域名完成，不能在 gongyike.shop。
- **合并转码**：`bash scripts/merge-course-video.sh <course> <base> <lessonId>` → cat 分片为临时 mp4 → ffmpeg（libx264/aac、`-movflags +faststart`、半核 `-threads`）→ `public/course/videos/<course>/<lessonId>.mp4`（随代码包部署，Vercel 静态支持 206 Range，无大小门槛）。
- **登记上线**：转码后在 Supabase `course_catalog` 表（或后台课程编辑）对应课程 lesson 的 `video` 填同域相对路径 `/course/videos/<course>/<lessonId>.mp4`；push prod 分支 → Vercel 重新部署 → 观看链接 `https://www.gongyike.shop/course/watch.html?c=<course>&l=<lesson>`。
- `/tmp/yijing_upload` 只是上传中转（会被沙箱回收清理），最终视频必须落进 `public/course/videos/` 才持久。
