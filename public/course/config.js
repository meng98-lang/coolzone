/*
 * 《我的后半生》课程配置 —— 标准模板
 * 视频直链来自对象存储（course-media bucket），持久化，稳定可播放。
 *   day1 -> /course/?v=front#/day1  第1节
 *   day2 -> /course/?v=front#/day2  第2节
 *   day3 -> /course/?v=front#/day3  第3节
 */
window.COURSE = {
  siteName: "我的后半生",
  brand: "我的后半生",

  lessons: [
    {
      id: "test",
      day: "第 1 节",
      title: "测试",
      desc: "测试课程，用于验证播放器限制功能（禁快进/禁倍速/隐藏时长）。",
      duration: "",
      points: [],
      video: "/course/videos/course_1/day1.mp4",
      poster: "",
      hideDuration: true,
    },
    {
      id: "day1",
      day: "第 1 节",
      title: "我的后半生 · 第一节",
      desc: "《我的后半生》课程第一节课。",
      duration: "约 111 分钟",
      points: ["本节要点一", "本节要点二", "本节要点三"],
      video:
        "https://br-sharp-roan-02ea13e0.supabase2.aidap-global.cn-beijing.volces.com/storage/v1/object/public/course-media/lesson1/index.m3u8",
      poster: "",
    },
    {
      id: "day2",
      day: "第 2 节",
      title: "我的后半生 · 第二节",
      desc: "《我的后半生》课程第二节课。",
      duration: "约 61 分钟",
      points: ["本节要点一", "本节要点二", "本节要点三"],
      video:
        "https://br-sharp-roan-02ea13e0.supabase2.aidap-global.cn-beijing.volces.com/storage/v1/object/public/course-media/lesson2/index.m3u8",
      poster: "",
    },
    {
      id: "day3",
      day: "第 3 节",
      title: "我的后半生 · 第三节",
      desc: "《我的后半生》课程第三节课。",
      duration: "约 77 分钟",
      points: ["本节要点一", "本节要点二", "本节要点三"],
      video:
        "https://br-sharp-roan-02ea13e0.supabase2.aidap-global.cn-beijing.volces.com/storage/v1/object/public/course-media/lesson3/index.m3u8",
      poster: "",
    },
  ],
};