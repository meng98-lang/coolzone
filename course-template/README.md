# 公益课程 · 标准模板（标准化流程）

> 目标：每门课都用同一套「稳定版」模板，杜绝播放失败与内容丢失。
> 本模板来自一套**从未出现播放失败**的线上方案（v1/v2/v3），原样固化。

## 为什么这套模板从不出错

| 环节 | 稳定方案 | 之前《易经》失败根因 |
|------|----------|---------------------|
| 前端 | 纯静态页（无后端、零依赖故障） | Next 动态页 / dev 预览实例（`instance_not_found`） |
| 视频存储 | **Supabase 对象存储（持久化）** | 本地 `/tmp`（被清空） |
| 播放器 | **本地打包 hls.min.js**（不依赖外网 CDN） | 外网 CDN 不稳定 |
| 转码 | HLS（index.m3u8 分片，可断点续播） | 单大 MP4（体积大、加载慢） |

## 目录结构

```
course-template/
├── vercel.json          # 短链路由：/v1 → /watch.html?id=day1 ...
├── src/
│   ├── index.html       # 课程列表首页
│   ├── watch.html       # 播放页（读 ?id 选课，调 MiniPlayer）
│   ├── config.js        # ★ 所有课程配置都改这里（标题/视频直链）
│   ├── js/
│   │   ├── app.js       # 首页渲染课程列表
│   │   └── player.js    # 防快进播放器（进度记忆/原速锁定/错误恢复）
│   ├── styles/main.css
│   └── vendor/
│       ├── hls.min.js       # 本地打包（离线可用）
│       └── supabase.min.js
```

## 生产流程（后台上传固定为以下步骤）

### 1. 上传视频到对象存储（持久化，存 key 不存 URL）
- 视频先经代理服务器转码为 HLS（`index.m3u8` + 分片）。
- 通过对象存储 SDK 上传，**记住返回的 key**（不要自拼 URL）。

### 2. 拿到视频直链（公开可播放）
- 将 HLS 产物放入对象存储公开读的目录（如 `course-media/lesson<N>/index.m3u8`），得到可播放直链。

### 3. 写入课程配置 `src/config.js`
- 在 `window.COURSE.lessons` 里新增/修改一节课，填 `id / day / title / desc / duration / points / video(直链) / poster`。

### 4. 配置短链 `vercel.json`
- 每节课一个短链，如 `/v1` → `/watch.html?id=day1`（可永久/临时重定向）。

### 5. 部署到 Vercel
- 静态部署整个 `course-template`（无构建命令），自动上线。

### 6. 出播放链接给客户
- 每节课一个独立、稳定的短链（如 `https://<域名>/v1`）。

## 数据持久化约定（关键）
- **永远不要把课程视频放在服务器临时目录**（如 `/tmp`），会被清理导致内容丢失。
- 一律放进**对象存储**，用返回的 key 记录，课程配置里填公开直链。
- 每次发布新课后，把课程名 + 各节标题 + 视频直链发给运维/Agent，由 Agent 更新 `config.js` 与 `vercel.json` 并重新部署。