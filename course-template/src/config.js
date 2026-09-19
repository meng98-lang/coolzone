/*
 * 课程配置 —— 所有内容都在这里改，不用碰其它文件。
 * 每节课有独立链接：
 *   第1节: /v1   第2节: /v2   第3节: /v3   （vercel.json 中配置）
 *
 * 真实视频上线：把每节课的 video 换成对象存储/CDN 的直链即可。
 */
window.COURSE = {
  siteName: "公益课程",
  brand: "公益课",

  lessons: [
    {
      id: "day1",
      day: "第 1 节",
      title: "课程 · 第一节",
      desc: "课程第一节课简介。",
      duration: "约 60 分钟",
      points: ["要点一", "要点二", "要点三"],
      video: "https://对象存储公开直链/index.m3u8",
      poster: "",
    },
    {
      id: "day2",
      day: "第 2 节",
      title: "课程 · 第二节",
      desc: "课程第二节课简介。",
      duration: "约 60 分钟",
      points: ["要点一", "要点二", "要点三"],
      video: "https://对象存储公开直链/index.m3u8",
      poster: "",
    },
    {
      id: "day3",
      day: "第 3 节",
      title: "课程 · 第三节",
      desc: "课程第三节课简介。",
      duration: "约 60 分钟",
      points: ["要点一", "要点二", "要点三"],
      video: "https://对象存储公开直链/index.m3u8",
      poster: "",
    },
  ],
};