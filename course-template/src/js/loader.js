/*
 * 课程数据加载器（方案B：后台保存后播放页即时生效）
 * 实时从 /api/courses 拉取多课程数据，失败时回退到静态 config.js（兜底，永不白屏）。
 * 挂载到 window.CourseStore。
 */
(function () {
  var API = "/api/courses";
  var STATIC = window.COURSE || null; // config.js 旧兜底

  // 静态兜底（旧版单课程结构）转 v2
  function staticFallback() {
    if (STATIC && Array.isArray(STATIC.lessons)) {
      return {
        courses: [
          {
            id: STATIC.id || "hbs",
            name: STATIC.siteName || "公益养生课堂",
            brand: STATIC.brand || STATIC.siteName || "公益养生课堂",
            lessons: STATIC.lessons,
          },
        ],
      };
    }
    return { courses: [] };
  }

  function flatten(catalog) {
    var all = [];
    (catalog.courses || []).forEach(function (c) {
      (c.lessons || []).forEach(function (l) {
        all.push({ course: c, lesson: l });
      });
    });
    return all;
  }

  /** 根据 URL 参数定位课程/课时。支持 ?c=&l= 与旧版 ?id= */
  function resolveLesson(catalog, params) {
    var courses = catalog.courses || [];
    var cid = params.get("c");
    var lid = params.get("l") || params.get("id");

    // 精确：course id + lesson id
    if (cid) {
      var c0 = courses.find(function (x) { return x.id === cid; });
      if (c0) {
        var l0 = (c0.lessons || []).find(function (x) { return x.id === lid; });
        if (l0) return { course: c0, lesson: l0, index: c0.lessons.indexOf(l0) };
        if (!lid && c0.lessons.length) return { course: c0, lesson: c0.lessons[0], index: 0 };
      }
    }
    // 旧版：仅 lesson id，全课程范围找第一个匹配
    if (lid) {
      for (var i = 0; i < courses.length; i++) {
        var c1 = courses[i];
        var found = (c1.lessons || []).find(function (x) { return x.id === lid; });
        if (found) return { course: c1, lesson: found, index: c1.lessons.indexOf(found) };
      }
    }
    // 默认第一门课第一节
    if (courses.length && courses[0].lessons.length) {
      return { course: courses[0], lesson: courses[0].lessons[0], index: 0 };
    }
    return null;
  }

  var cache = null;
  function load(useCache) {
    if (useCache && cache) return Promise.resolve(cache);
    return fetch(API, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("api fail")); })
      .then(function (d) {
        var catalog = d && d.courses && d.courses.length ? { courses: d.courses } : staticFallback();
        cache = catalog;
        return catalog;
      })
      .catch(function () {
        var fb = staticFallback();
        cache = fb;
        return fb;
      });
  }

  window.CourseStore = {
    load: load,
    resolveLesson: resolveLesson,
    flatten: flatten,
  };
})();
