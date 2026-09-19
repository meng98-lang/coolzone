/*
 * 防快进课程播放器
 * - 自定义控件，隐藏原生控制条（无下载/拖动/倍速入口）
 * - 进度条仅展示、不可点击拖动；拦截一切「跳到未观看部分」的 seek
 * - 允许正常播放、暂停、全屏；记忆上次观看位置（自动续播）
 */
(function () {
  const TOLERANCE = 2; // 允许的误差秒数（网络抖动等）
  const STORE_KEY = (id) => `vt_progress_${id}`;

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function mount(container, lesson) {
    container.innerHTML = `
      <div class="player">
        <div class="stage" id="stage">
          <video id="video" playsinline webkit-playsinline="true" x5-playsinline
                 preload="metadata" disablepictureinpicture
                 controlslist="nodownload noplaybackrate noremoteplayback nofullscreen"
                 ${lesson.poster ? `poster="${lesson.poster}"` : ""}></video>

          <div class="center-ui" id="centerUi">
            <button class="big-play" id="bigPlay" aria-label="播放">
              <svg viewBox="0 0 24 24" width="34" height="34"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="spinner" id="spinner" hidden></div>
          </div>

          <div class="v-error" id="vError" hidden>
            <p>视频加载失败，请检查网络后重试</p>
            <button class="v-error-retry" id="vErrorRetry" type="button">重新加载</button>
          </div>

          <div class="controls" id="controls">
            <div class="progress" id="progress">
              <div class="bar bar-buffered"></div>
              <div class="bar bar-unlocked"></div>
              <div class="bar bar-played"></div>
            </div>
            <div class="ctrl-row">
              <button class="icon-btn" id="playBtn" aria-label="播放/暂停">
                <svg class="ic-play" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                <svg class="ic-pause" viewBox="0 0 24 24" width="22" height="22" hidden><path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
              </button>
              <span class="time" id="time">00:00 / 00:00</span>
              <span class="lock-hint">
                <svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 1 1 6 0v3z"/></svg>
                课程不支持快进
              </span>
              <button class="icon-btn" id="fsBtn" aria-label="全屏">
                <svg class="ic-enter-fs" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M5 5h5V3H3v7h2zm9-2v2h5v5h2V3zm5 16h-5v2h7v-7h-2zM5 14H3v7h7v-2H5z"/></svg>
                <svg class="ic-exit-fs" viewBox="0 0 24 24" width="20" height="20" hidden><path fill="currentColor" d="M9 3H7v3H4v2h5zm8 0v3h-3v2h5V3zM4 16v2h3v3h2v-5zm13 0v5h2v-3h3v-2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>`;

    const video = container.querySelector("#video");
    const stage = container.querySelector("#stage");
    // 隐藏视频时长：为 true 时不显示「总时长」，只显示当前进度（学员无法得知总长度）
    const hideDuration = lesson.hideDuration === true;

    // 强制原速播放：任何倍速变化一律拉回 1x（拦截原生/快捷键/双击等方式）
    const LOCK_RATE = 1;
    video.playbackRate = LOCK_RATE;
    let rateLocking = false;
    video.addEventListener("ratechange", () => {
      if (rateLocking) return;
      rateLocking = true;
      try { video.playbackRate = LOCK_RATE; } catch (e) {}
      rateLocking = false;
    });
    // 某些环境初始化时读取 playbackRate，确保一拿到 video 就锁定
    Object.defineProperty(video, "playbackRate", {
      get() { return LOCK_RATE; },
      set() {},
      configurable: true,
    });
    const bigPlay = container.querySelector("#bigPlay");
    const centerUi = container.querySelector("#centerUi");
    const spinner = container.querySelector("#spinner");
    const vError = container.querySelector("#vError");
    const vErrorRetry = container.querySelector("#vErrorRetry");
    const playBtn = container.querySelector("#playBtn");
    const icPlay = container.querySelector(".ic-play");
    const icPause = container.querySelector(".ic-pause");
    const fsBtn = container.querySelector("#fsBtn");
    const timeEl = container.querySelector("#time");
    const barPlayed = container.querySelector(".bar-played");
    const barUnlocked = container.querySelector(".bar-unlocked");
    const barBuffered = container.querySelector(".bar-buffered");

    let maxWatched = 0; // 已正常观看到的最远位置（秒）
    let restoring = true; // 正在恢复进度，忽略期间的 seek 拦截
    let toastTimer = null;

    function toast(msg) {
      let t = container.querySelector(".v-toast");
      if (!t) {
        t = document.createElement("div");
        t.className = "v-toast";
        stage.appendChild(t);
      }
      t.textContent = msg;
      t.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
    }

    function setPlayingUI(playing) {
      icPlay.hidden = playing;
      icPause.hidden = !playing;
      bigPlay.hidden = playing;
      if (playing) centerUi.classList.add("hide");
      else centerUi.classList.remove("hide");
    }

    function togglePlay() {
      if (video.paused) {
        video.play().catch(() => toast("点击屏幕开始播放"));
      } else {
        video.pause();
      }
    }

    // 恢复上次进度
    function restore() {
      let saved = 0;
      try {
        saved = parseFloat(localStorage.getItem(STORE_KEY(lesson.id)) || "0") || 0;
      } catch (e) {}
      if (saved > 5 && isFinite(video.duration) && saved < video.duration - 10) {
        video.currentTime = saved;
        maxWatched = saved;
      }
      restoring = false;
    }

    let hls = null;
    let curSrc = null; // 当前源，供重新加载
    let useMse = false; // 是否走 hls.js(MSE)
    let netErrCount = 0; // 网络 fatal 连续次数

    function loadSrc(src) {
      curSrc = src;
      const isHls = /\.m3u8(\?|$)/i.test(src);
      // 1) 原生支持 HLS（iOS Safari、部分安卓）直接播
      if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
        useMse = false;
        video.src = src;
        return;
      }
      // 2) 安卓/Chrome 等用 hls.js（MSE）
      if (isHls && window.Hls && window.Hls.isSupported()) {
        if (hls) { try { hls.destroy(); } catch (e) {} }
        useMse = true;
        netErrCount = 0;
        hls = new window.Hls({
          // 顺序观看、禁快进：只做小缓冲，弱网下平稳拉流、不突发占带宽
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 20,
          maxMaxBufferLength: 40,
          manifestLoadingTimeOut: 15000,
          fragLoadingTimeOut: 30000,
          levelLoadingTimeOut: 15000,
          fragLoadingMaxRetry: 8,
          levelLoadingMaxRetry: 8,
          manifestLoadingMaxRetry: 3,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, (_evt, data) => {
          if (!data || !data.fatal) return;
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            // 弱网抖动：自动重试恢复；连续多次失败才提示
            netErrCount++;
            if (netErrCount <= 5) {
              try { hls.startLoad(); } catch (e) {}
            } else {
              showError();
            }
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            try { hls.recoverMediaError(); } catch (e) { showError(); }
          } else {
            showError();
          }
        });
        // 一旦恢复出帧/解析成功，重置网络错误计数并收起错误提示
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => { netErrCount = 0; });
        hls.on(window.Hls.Events.FRAG_BUFFERED, () => { netErrCount = 0; hideError(); });
        return;
      }
      // 3) 普通 MP4 / 其它
      useMse = false;
      video.src = src;
    }

    // 视频源（直链、.m3u8 或返回 {url} 的接口）
    function setSource() {
      const src = lesson.video;
      if (/^\/api\//.test(src)) {
        fetch(src)
          .then((r) => r.json())
          .then((d) => {
            if (d && d.url) loadSrc(d.url);
            else throw new Error("no url");
          })
          .catch(() => {
            showError();
          });
      } else {
        loadSrc(src);
      }
    }

    function showError() {
      // 若实际已在播/缓冲，不弹错误提示（避免误报）
      if (!video.paused && video.readyState >= 3) { hideError(); return; }
      if (useMse && hls) { try { hls.stopLoad(); } catch (e) {} }
      vError.hidden = false;
      spinner.hidden = true;
    }

    function hideError() {
      vError.hidden = true;
    }

    function reloadSource() {
      hideError();
      spinner.hidden = true;
      netErrCount = 0;
      if (useMse && hls) {
        try {
          hls.destroy();
        } catch (e) {}
        useMse = false;
        hls = null;
      }
      if (curSrc) loadSrc(curSrc);
    }

    vErrorRetry.addEventListener("click", reloadSource);

    // ---- 事件 ----
    video.addEventListener("loadedmetadata", () => {
      // 按视频真实比例自适应容器：竖屏→9:16 居中（限高防溢出），横屏→16:9 全宽
      const vw = video.videoWidth || 0;
      const vh = video.videoHeight || 0;
      if (vw > 0 && vh > 0) {
        const portrait = vh > vw;
        if (portrait) {
          // 竖屏：高度不超过视口的 60%，宽度按比例，居中显示
          const maxH = Math.min(window.innerWidth * (vh / vw), window.innerHeight * 0.62);
          stage.style.aspectRatio = `${vw} / ${vh}`;
          stage.style.maxWidth = `${(maxH * vw) / vh}px`;
          stage.classList.remove("landscape");
        } else {
          stage.style.aspectRatio = `${vw} / ${vh}`;
          stage.style.maxWidth = "100%";
          stage.classList.add("landscape");
        }
      }
      restore();
      timeEl.textContent = hideDuration
        ? `00:00`
        : `00:00 / ${fmt(video.duration)}`;
    });

    video.addEventListener("timeupdate", () => {
      if (!restoring && video.currentTime > maxWatched) {
        maxWatched = video.currentTime;
      }
      const d = video.duration || 0;
      timeEl.textContent = hideDuration
        ? `${fmt(video.currentTime)}`
        : `${fmt(video.currentTime)} / ${fmt(d)}`;
      const pct = d ? (video.currentTime / d) * 100 : 0;
      const upct = d ? (maxWatched / d) * 100 : 0;
      barPlayed.style.width = pct + "%";
      barUnlocked.style.width = upct + "%";
      // 存进度（节流：每 5 秒）
      if (Math.floor(video.currentTime) % 5 === 0) {
        try {
          localStorage.setItem(STORE_KEY(lesson.id), String(video.currentTime));
        } catch (e) {}
      }
    });

    video.addEventListener("progress", () => {
      try {
        if (video.buffered.length && video.duration) {
          const end = video.buffered.end(video.buffered.length - 1);
          barBuffered.style.width = (end / video.duration) * 100 + "%";
        }
      } catch (e) {}
    });

    // 核心：拦截快进
    video.addEventListener("seeking", () => {
      if (restoring) return;
      if (video.currentTime > maxWatched + TOLERANCE) {
        const backTo = Math.max(maxWatched, 0);
        video.currentTime = backTo;
        toast("为保证学习效果，课程不支持快进");
      }
    });

    video.addEventListener("play", () => setPlayingUI(true));
    video.addEventListener("pause", () => setPlayingUI(false));
    video.addEventListener("waiting", () => {
      spinner.hidden = false;
    });
    video.addEventListener("canplay", () => {
      spinner.hidden = true;
    });
    video.addEventListener("playing", () => {
      spinner.hidden = true;
      hideError(); // 一旦恢复播放，自动收起错误提示
    });
    video.addEventListener("canplay", () => {
      spinner.hidden = true;
      hideError();
    });
    video.addEventListener("error", () => {
      // 原生视频源（iOS HLS / MP4）才在 error 时提示；
      // hls.js(MSE) 的错误由 hls 自身恢复处理，避免在恢复期间误弹
      if (!useMse) showError();
    });

    bigPlay.addEventListener("click", togglePlay);
    playBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", () => {
      // 移动端点画面：播放/暂停（不显示原生控件）
      togglePlay();
    });

    // 全屏（伪全屏：CSS 铺满，不进系统原生播放器，避免出现系统倍速按钮）
    fsBtn.addEventListener("click", () => {
      const entering = !stage.classList.contains("stage-fs");
      stage.classList.toggle("stage-fs", entering);
      document.documentElement.classList.toggle("fs-lock", entering);
      const inSvg = stage.querySelector(".ic-enter-fs");
      const outSvg = stage.querySelector(".ic-exit-fs");
      if (inSvg) inSvg.hidden = entering;
      if (outSvg) outSvg.hidden = !entering;
      if (entering) {
        // 进入全屏续播
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
        if (!video.paused) setPlayingUI(true);
      }
    });
    // 退出伪全屏：Esc 键
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && stage.classList.contains("stage-fs")) {
        stage.classList.remove("stage-fs");
        document.documentElement.classList.remove("fs-lock");
        const inSvg = stage.querySelector(".ic-enter-fs");
        const outSvg = stage.querySelector(".ic-exit-fs");
        if (inSvg) inSvg.hidden = false;
        if (outSvg) outSvg.hidden = true;
      }
    });

    // 防右键下载/审查
    stage.addEventListener("contextmenu", (e) => e.preventDefault());

    // 防键盘快进（方向键 / 数字键 / J/L）
    document.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        ["ArrowRight", "ArrowLeft", "PageUp", "PageDown", "MediaTrackNext"].includes(
          e.key
        ) ||
        e.key.toLowerCase() === "l" ||
        e.key.toLowerCase() === "j"
      ) {
        if (stage.getBoundingClientRect && isInView(stage)) {
          e.preventDefault();
          toast("课程不支持快进");
        }
      }
    });

    function isInView(el) {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }

    setSource();
  }

  window.MiniPlayer = { mount };
})();
