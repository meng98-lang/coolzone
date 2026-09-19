/* 课程列表页：实时从后台读取多课程并分组渲染 */
(function () {
  var list = document.getElementById("lessonList");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m];
    });
  }

  function cardHtml(course, l, idx) {
    var href = "watch.html?c=" + encodeURIComponent(course.id) + "&l=" + encodeURIComponent(l.id);
    return (
      '<a class="lesson-card" href="' + href + '">' +
      '<div class="lesson-num"><span class="d">' + (idx + 1) + '</span><span class="t">节</span></div>' +
      '<div class="lesson-body">' +
      "<h3>" + esc(l.title) + "</h3>" +
      '<p class="desc">' + esc(l.desc || "") + "</p>" +
      '<div class="lesson-meta">' +
      (l.duration ? '<span class="tag dur">⏱ ' + esc(l.duration) + "</span>" : "") +
      '<span class="tag">手机直接观看</span>' +
      "</div></div>" +
      '<span class="lesson-go">观看' +
      '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>' +
      "</span></a>"
    );
  }

  window.CourseStore.load().then(function (catalog) {
    var courses = catalog.courses || [];
    if (!courses.length) {
      list.innerHTML = '<p style="color:var(--muted)">课程准备中…</p>';
      return;
    }

    // 只有一门课时直接展示；多门课时分组带课程标题
    var html = "";
    if (courses.length === 1) {
      var only = courses[0];
      document.title = esc(only.name);
      document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = only.brand || only.name; });
      var heroH = document.querySelector(".hero h1");
      if (heroH) heroH.textContent = esc(only.name);
      html = only.lessons.map(function (l, i) { return cardHtml(only, l, i); }).join("");
    } else {
      html = courses
        .map(function (course) {
          return (
            '<div class="course-group">' +
            '<h2 class="course-group-title">' + esc(course.name) + "</h2>" +
            course.lessons.map(function (l, i) { return cardHtml(course, l, i); }).join("") +
            "</div>"
          );
        })
        .join("");
    }
    list.innerHTML = html;
  });
})();
