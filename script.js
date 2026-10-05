/**
 * Birthday Surprise Web Application Logic - Ocean Butterfly Theme
 * Interactive navigation with Cinematic Butterfly Swarm Transitions,
 * audio synthesizer, confetti, lightbox, and customization
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. STATE & CONFIGURATION (STATIC)
  // ==========================================
  localStorage.removeItem("ultah_surprise_data");
  let appData = CONFIG;

  // ==========================================
  // 1B. TRANSPARENT ASSETS PROCESSING
  // Removes black background from JPG butterfly assets
  // so they blend seamlessly like PNG stickers
  // ==========================================
  function makeImageTransparent(imgElement) {
    if (!imgElement) return;
    const src = imgElement.getAttribute("src") || "";
    // If image is already a transparent PNG, skip processing to avoid artifacts
    if (src.toLowerCase().includes(".png")) {
      return;
    }

    const process = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = imgElement.naturalWidth || imgElement.width || 300;
        const h = imgElement.naturalHeight || imgElement.height || 300;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgElement, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const isCamera = imgElement.classList.contains("camera-img");

        if (isCamera) {
          const camLeft = Math.floor(w * 0.08);
          const camRight = Math.floor(w * 0.92);
          const camTop = Math.floor(h * 0.22);
          const camBottom = Math.floor(h * 0.74);

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const p = (y * w + x) * 4;
              const r = data[p], g = data[p+1], b = data[p+2];
              const maxVal = Math.max(r, g, b);

              if (x < camLeft || x > camRight || y < camTop || y > camBottom) {
                data[p+3] = 0;
              } else if (
                (y < camTop + 35 || y > camBottom - 20 || x < camLeft + 35 || x > camRight - 35) &&
                maxVal < 45
              ) {
                data[p+3] = 0;
              } else {
                data[p+3] = 255;
              }
            }
          }
        } else {
          // Smooth luminance-based alpha keying for dark background removal
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            const maxVal = Math.max(r, g, b);

            if (maxVal <= 22) {
              data[i+3] = 0;
            } else if (maxVal < 85) {
              const t = (maxVal - 22) / (85 - 22);
              data[i+3] = Math.round(255 * (t * t * (3 - 2 * t)));
            } else {
              data[i+3] = 255;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        imgElement.src = canvas.toDataURL("image/png");
      } catch (err) {
        console.warn("Could not process transparency for image:", err);
      }
    };

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
      process();
    } else {
      imgElement.addEventListener("load", process, { once: true });
    }
  }

  // Process all dark butterfly and decorative assets
  document.querySelectorAll(".asset-screened, .camera-img, .mini-camera-img, .present-img-glow, .rose-img-blend").forEach(img => {
    makeImageTransparent(img);
  });

  // ==========================================
  // 2. AUDIO SYNTHESIZER & CELESTIAL CHIMES
  // (Provides offline ocean lofi music & chimes)
  // ==========================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let bgmTimer = null;
  let bgmNoteIndex = 0;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Oceanic Dream Lofi Melody Notes (D Major / Pentatonic shimmer)
  const lofiNotes = [
    293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 293.66,
    329.63, 392.00, 493.88, 659.25, 493.88, 392.00, 329.63,
    220.00, 293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
    196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66
  ];

  function playSynthNote(freq, duration = 1.2, type = "triangle", gainLevel = 0.07) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  function playChime(freqs = [587.33, 739.99, 880.00, 1174.66]) {
    initAudioContext();
    if (!audioCtx) return;
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.85);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.85);
        } catch (e) {}
      }, idx * 75);
    });
  }

  function playFlutterTransitionSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      // 1. Crystalline Glissando Cascade (celestial harp bells)
      const harpChords = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      harpChords.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
          } catch (e) {}
        }, idx * 40);
      });

      // 2. Soft airy flutter sweep (fairy wing rush)
      setTimeout(() => {
        try {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(320, audioCtx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.35);
          gain2.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain2.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.15);
          gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.5);
        } catch (e) {}
      }, 90);

      // 3. Shimmering high bell chime on screen reveal (t = 480ms)
      setTimeout(() => {
        try {
          const bell = audioCtx.createOscillator();
          const bellGain = audioCtx.createGain();
          bell.type = "sine";
          bell.frequency.setValueAtTime(1760, audioCtx.currentTime);
          bellGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
          bell.connect(bellGain);
          bellGain.connect(audioCtx.destination);
          bell.start();
          bell.stop(audioCtx.currentTime + 0.8);
        } catch (e) {}
      }, 480);
    } catch (e) {}
  }


  function startLofiBackgroundMusic() {
    initAudioContext();
    isMusicPlaying = true;
    updateMusicUI(true);

    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = setInterval(() => {
      if (!isMusicPlaying) return;
      const note = lofiNotes[bgmNoteIndex % lofiNotes.length];
      playSynthNote(note, 1.4, "triangle", 0.06);

      // Soft deep bass every 4 beats
      if (bgmNoteIndex % 4 === 0) {
        playSynthNote(note / 2, 2.2, "sine", 0.09);
      }
      bgmNoteIndex++;
    }, 450);
  }

  function stopLofiBackgroundMusic() {
    isMusicPlaying = false;
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
    updateMusicUI(false);
  }

  function toggleMusic() {
    initAudioContext();
    if (isMusicPlaying) {
      stopLofiBackgroundMusic();
    } else {
      startLofiBackgroundMusic();
    }
  }

  function updateMusicUI(playing) {
    const btn = document.getElementById("btn-toggle-bgm");
    if (btn) {
      const icon = btn.querySelector(".music-icon");
      const text = btn.querySelector(".music-text");
      if (playing) {
        if (icon) icon.classList.add("rotating");
        if (text) text.textContent = "Music On";
      } else {
        if (icon) icon.classList.remove("rotating");
        if (text) text.textContent = "Music Off";
      }
    }

    const playerPlayIcon = document.getElementById("player-play-icon");
    if (playerPlayIcon) {
      playerPlayIcon.textContent = playing ? "❚❚" : "▶";
    }

    const vinylWidget = document.getElementById("btn-mini-vinyl-play");
    if (vinylWidget) {
      if (playing) {
        vinylWidget.classList.add("playing");
      } else {
        vinylWidget.classList.remove("playing");
      }
      const playToggle = vinylWidget.querySelector(".play-toggle, .vinyl-play-icon");
      if (playToggle) playToggle.textContent = playing ? "❚❚" : "▶";
    }
  }

  // ==========================================
  // ==========================================
  // 3. SWIRLING BUTTERFLY CLUSTER ZOOM TRANSITION
  // Dense cluster of 3D Morpho butterflies swirling & zooming in / out
  // ==========================================
  const transitionOverlay = document.getElementById("butterfly-transition-overlay");
  const clusterStage = document.getElementById("butterfly-cluster-stage");
  const clusterRotator = document.getElementById("cluster-rotator");
  const transitionLightFlash = document.getElementById("transition-light-flash");

  function triggerButterflyTransition(callback) {
    playFlutterTransitionSound();

    if (!transitionOverlay || !clusterStage || !clusterRotator) {
      if (callback) callback();
      return;
    }

    clusterRotator.innerHTML = "";
    transitionOverlay.classList.add("animating");

    // Generate a dense, beautiful cluster of 46 glowing 3D Morpho butterflies
    const count = 46;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "cluster-bf3d";

      // Golden spiral distribution creates a natural, dense swirling flock
      const goldenAngle = 2.39996;
      const theta = i * goldenAngle;
      // Exponential distribution: denser in center, tapering to outer edges
      const norm = i / count;
      const radius = 24 + Math.pow(norm, 0.72) * 250;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;

      // Butterfly size: slightly smaller in dense core, full size on outer edge
      const sizeW = Math.round(26 + Math.pow(norm, 0.6) * 28);
      const sizeH = Math.round(sizeW * 0.84);

      // Facing angle tangentially aligned with spiral swirl
      const facingDeg = (theta + Math.PI / 2 + 0.25) * (180 / Math.PI);

      b.style.width = `${sizeW}px`;
      b.style.height = `${sizeH}px`;
      b.style.marginLeft = `${-sizeW / 2}px`;
      b.style.marginTop = `${-sizeH / 2}px`;
      b.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${facingDeg}deg)`;

      b.innerHTML = `
        <div class="cluster-bf3d-assembly">
          <div class="wing-left"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
          <div class="bf3d-body"><div class="bf3d-antennae"></div></div>
          <div class="wing-right"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
        </div>
      `;
      clusterRotator.appendChild(b);
    }

    // Add sparkling stardust dots inside the cluster
    for (let j = 0; j < 18; j++) {
      const dot = document.createElement("div");
      dot.className = "cluster-sparkle-dot";
      const sAngle = Math.random() * Math.PI * 2;
      const sDist = Math.random() * 260;
      const sSize = Math.random() * 4 + 2;
      dot.style.width = `${sSize}px`;
      dot.style.height = `${sSize}px`;
      dot.style.left = `calc(50% + ${Math.cos(sAngle) * sDist}px)`;
      dot.style.top = `calc(50% + ${Math.sin(sAngle) * sDist}px)`;
      dot.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      clusterRotator.appendChild(dot);
    }

    // Reset initial transform states
    clusterStage.style.transition = "none";
    clusterStage.style.transform = "scale(0.06) translateZ(-400px)";
    clusterStage.style.opacity = "0";

    clusterRotator.style.transition = "none";
    clusterRotator.style.transform = "rotate(0deg)";

    if (transitionLightFlash) {
      transitionLightFlash.style.transition = "none";
      transitionLightFlash.style.opacity = "0";
    }

    // Force layout reflow
    void clusterStage.offsetWidth;

    // Phase 1: FAST SWIRL & DRAMATIC ZOOM IN (0ms -> 460ms)
    // Cluster rushes towards the screen, spinning and expanding to engulf viewport
    requestAnimationFrame(() => {
      clusterStage.style.transition = "transform 0.46s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease-out";
      clusterStage.style.transform = "scale(3.5) translateZ(260px)";
      clusterStage.style.opacity = "1";

      clusterRotator.style.transition = "transform 1.05s cubic-bezier(0.2, 0.8, 0.25, 1)";
      clusterRotator.style.transform = "rotate(620deg)";
    });

    // Soft radiant light bloom at peak zoom
    setTimeout(() => {
      if (transitionLightFlash) {
        transitionLightFlash.style.transition = "opacity 0.22s ease-in-out";
        transitionLightFlash.style.opacity = "0.9";
      }
    }, 380);

    // Phase 2: SEAMLESS SCREEN SWAP AT PEAK ZOOM (450ms)
    setTimeout(() => {
      if (callback) callback();
    }, 450);

    // Phase 3: SWIRL & ZOOM OUT / FLY-THROUGH (480ms -> 980ms)
    // Cluster continues spinning smoothly and zooms out into the newly revealed screen
    setTimeout(() => {
      if (transitionLightFlash) {
        transitionLightFlash.style.transition = "opacity 0.42s ease-out";
        transitionLightFlash.style.opacity = "0";
      }

      clusterStage.style.transition = "transform 0.48s cubic-bezier(0.16, 0.9, 0.3, 1), opacity 0.42s ease-out";
      clusterStage.style.transform = "scale(0.04) translateZ(-350px)";
      clusterStage.style.opacity = "0";

      clusterRotator.style.transform = "rotate(1080deg)";
    }, 480);

    // Phase 4: CLEANUP (1020ms)
    setTimeout(() => {
      transitionOverlay.classList.remove("animating");
      clusterRotator.innerHTML = "";
    }, 1020);
  }

  // ==========================================
  // 4. SCREEN NAVIGATION WITH TRANSITIONS
  // ==========================================
  const screens = {
    landing: document.getElementById("screen-landing"),
    "screen-landing": document.getElementById("screen-landing"),
    menu: document.getElementById("screen-menu"),
    "screen-menu": document.getElementById("screen-menu"),
    game: document.getElementById("screen-game"),
    "screen-game": document.getElementById("screen-game"),
    journey: document.getElementById("screen-game"),
    "screen-journey": document.getElementById("screen-game"),
    moment: document.getElementById("screen-moment"),
    "screen-moment": document.getElementById("screen-moment"),
    playlist: document.getElementById("screen-playlist"),
    "screen-playlist": document.getElementById("screen-playlist"),
    gift: document.getElementById("screen-gift"),
    "screen-gift": document.getElementById("screen-gift"),
  };

  function showScreen(screenKey) {
    const rawKey = screenKey || "menu";
    const cleanKey = rawKey.replace(/^screen-/, "");

    // Cleanup when navigating away from game screen
    if (cleanKey !== "game" && cleanKey !== "journey") {
      pauseFlappyGame();
      const cakeModalEl = document.getElementById("game-cake-modal");
      if (cakeModalEl) cakeModalEl.style.display = "none";
    }

    triggerButterflyTransition(() => {
      // Deactivate all screens
      document.querySelectorAll(".app-screen").forEach(screen => {
        screen.classList.remove("active");
      });

      // Target resolution: checks normalized key, original key, or DOM element by ID
      const targetScreen =
        screens[cleanKey] ||
        screens[rawKey] ||
        document.getElementById(`screen-${cleanKey}`) ||
        document.getElementById(rawKey) ||
        screens.menu;

      if (targetScreen) {
        targetScreen.classList.add("active");
        targetScreen.scrollTop = 0;
      }

      if (cleanKey === "game" || cleanKey === "journey") {
        initFlappyCanvasSize();
        if (gameState === "IDLE") {
          startFlappyIdleLoop();
        }
      }
    });
  }

  // Ensure landing screen is always active on load
  // Clean any stale ?screen=... query params so users are never trapped in sub-screens
  if (window.location.search || window.location.hash) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}
  }

  // Deactivate all screens and ensure ONLY landing is active
  document.querySelectorAll(".app-screen").forEach(screen => {
    screen.classList.remove("active");
  });
  if (screens.landing) {
    screens.landing.classList.add("active");
  }

  // Screen 1: "TAP FOR SURPRISE" -> Go to Menu (Screen 2)
  const tapSurpriseBtn = document.getElementById("btn-tap-surprise");
  if (tapSurpriseBtn) {
    tapSurpriseBtn.addEventListener("click", () => {
      if (!isMusicPlaying) {
        startLofiBackgroundMusic();
      }
      showScreen("menu");
    });
  }

  // Screen 2: Menu Options
  document.getElementById("card-game")?.addEventListener("click", () => showScreen("game"));
  document.getElementById("card-journey")?.addEventListener("click", () => showScreen("game"));
  document.getElementById("card-moment")?.addEventListener("click", () => showScreen("moment"));
  document.getElementById("card-playlist")?.addEventListener("click", () => showScreen("playlist"));
  document.getElementById("card-gift")?.addEventListener("click", () => showScreen("gift"));

  // Back Buttons on all screens (supports custom data-target with or without 'screen-' prefix)
  document.querySelectorAll(".btn-back-retro").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetScreen = btn.getAttribute("data-target") || "menu";
      const cakeModalEl = document.getElementById("game-cake-modal");
      if (cakeModalEl) cakeModalEl.style.display = "none";
      showScreen(targetScreen);
    });
  });

  // Audio Toggle Button
  document.getElementById("btn-toggle-bgm")?.addEventListener("click", toggleMusic);

  // ==========================================
  // 4B. BIRTHDAY MINI GAME: FLAPPY OCEAN BUTTERFLY
  // Fly glowing butterfly through crystal spires,
  // collect birthday gifts & stars, unlock Birthday Cake at 15 pts!
  // ==========================================
  const flappyCanvas = document.getElementById("flappy-canvas");
  const flappyCtx = flappyCanvas ? flappyCanvas.getContext("2d") : null;
  const gameArena = document.getElementById("game-arena");
  const gameScoreVal = document.getElementById("game-score-val");
  const gameProgressFill = document.getElementById("game-progress-fill");
  const gameProgressHint = document.getElementById("game-progress-hint");
  const gameBestVal = document.getElementById("game-best-val");
  const gameWishesLayer = document.getElementById("game-wishes-layer");
  const gameStartBanner = document.getElementById("game-start-banner");
  const gameOverBanner = document.getElementById("game-over-banner");
  const gameOverScore = document.getElementById("game-over-score");
  const gameOverBest = document.getElementById("game-over-best");
  const gameOverHint = document.getElementById("game-over-hint");
  const btnStartGameNow = document.getElementById("btn-start-game-now");
  const btnRestartGame = document.getElementById("btn-restart-game");
  const btnOpenCakeAnyway = document.getElementById("btn-open-cake-anyway");
  const btnMobileFlap = document.getElementById("btn-mobile-flap");

  const gameCakeModal = document.getElementById("game-cake-modal");
  const celebrationCandle = document.getElementById("celebration-candle");
  const candleFlameElement = document.getElementById("candle-flame-element");
  const candleSmokePuff = document.getElementById("candle-smoke-puff");
  const btnTapBlowCandle = document.getElementById("btn-tap-blow-candle");
  const cakeRevealedLetter = document.getElementById("cake-revealed-letter");
  const btnGameReplay = document.getElementById("btn-game-replay");

  const TARGET_GOAL_SCORE = 15;
  let flappyScore = 0;
  let flappyBestScore = parseInt(localStorage.getItem("ultah_flappy_best") || "0", 10);
  let gameState = "IDLE"; // "IDLE" | "PLAYING" | "GAMEOVER"
  let hasUnlockedCake = false;
  let hasBlownCandle = false;
  let animFrameId = null;
  let arenaW = 800;
  let arenaH = 480;
  let dpr = 1;

  // Butterfly Player
  const player = {
    x: 120,
    y: 220,
    r: 14,
    vy: 0,
    gravity: 0.35,
    jumpPower: -6.5,
    angle: 0,
    targetAngle: 0,
    wingPhase: 0,
    isFlapping: false,
    trail: []
  };

  // World Obstacles & Collectibles
  let pipes = [];
  let collectibles = [];
  let particles = [];
  let starsBg = [];
  let frameCount = 0;
  const PIPE_GAP = 165;
  const PIPE_WIDTH = 54;
  const PIPE_SPACING = 270;
  const SCROLL_SPEED = 2.4;

  const SWEET_WISHES = [
    "Happy Birthday! ✨",
    "Semangat Sayang! 💖",
    "Kupu-kupu Terindah! 🦋",
    "Makin Bersinar! 🌟",
    "You Are Amazing! 💎",
    "Selalu Bahagia! 🍰",
    "Doa Terbaik Untukmu! 🎁",
    "I Love You! 💙",
    "Senyum Manismu! 😊",
    "Cantik Banget Hari Ini! 💫"
  ];

  // Initialize Canvas Dimensions & Ambient Stars
  function initFlappyCanvasSize() {
    if (!flappyCanvas || !gameArena) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    arenaW = gameArena.clientWidth || 800;
    arenaH = gameArena.clientHeight || 480;

    flappyCanvas.width = arenaW * dpr;
    flappyCanvas.height = arenaH * dpr;
    if (flappyCtx) {
      flappyCtx.setTransform(1, 0, 0, 1, 0, 0);
      flappyCtx.scale(dpr, dpr);
    }

    player.x = Math.max(90, Math.min(arenaW * 0.2, 140));

    // Initialize stars in background
    if (starsBg.length === 0) {
      starsBg = [];
      for (let i = 0; i < 45; i++) {
        starsBg.push({
          x: Math.random() * arenaW,
          y: Math.random() * arenaH,
          r: Math.random() * 1.8 + 0.6,
          speed: Math.random() * 0.4 + 0.2,
          alpha: Math.random() * 0.7 + 0.3
        });
      }
    }

    if (gameBestVal) gameBestVal.textContent = flappyBestScore;
    updateFlappyHud();
  }

  window.addEventListener("resize", () => {
    if (screens.game && screens.game.classList.contains("active")) {
      initFlappyCanvasSize();
    }
  });

  function updateFlappyHud() {
    if (gameScoreVal) gameScoreVal.textContent = flappyScore;
    if (gameBestVal) gameBestVal.textContent = flappyBestScore;

    const progressPercent = Math.min(100, (flappyScore / TARGET_GOAL_SCORE) * 100);
    if (gameProgressFill) gameProgressFill.style.width = `${progressPercent}%`;

    if (gameProgressHint) {
      if (hasUnlockedCake || flappyScore >= TARGET_GOAL_SCORE) {
        gameProgressHint.textContent = "🎉 Kue Ulang Tahun Terbuka! Tiup Lilin & Ucapkan Doa Terindah 🎂";
      } else {
        const remaining = TARGET_GOAL_SCORE - flappyScore;
        gameProgressHint.textContent = `Kumpulkan ${remaining} poin lagi untuk membuka kue ulang tahun ✨`;
      }
    }
  }

  // Audio synthesizers for Flappy Butterfly
  function playFlapSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(360, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {}
  }

  function playItemCollectSound(points) {
    if (points >= 5) {
      playChime([783.99, 1046.50, 1318.51, 1567.98]); // Diamond chime
    } else {
      playChime([659.25, 880.00, 1174.66]); // Star / Gift chime
    }
  }

  function playHitSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.26);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.27);
    } catch (e) {}
  }

  // Show Floating Wish Tag on Canvas/Arena
  function spawnFloatingWish(x, y, text) {
    if (!gameWishesLayer) return;
    const wishEl = document.createElement("div");
    wishEl.className = "floating-wish-tag";
    wishEl.textContent = text || SWEET_WISHES[Math.floor(Math.random() * SWEET_WISHES.length)];
    wishEl.style.left = `${x}px`;
    wishEl.style.top = `${y}px`;
    gameWishesLayer.appendChild(wishEl);

    setTimeout(() => {
      wishEl.remove();
    }, 1600);
  }

  // Spawn Crystal Pillars & Collectibles
  function spawnPipe(startX) {
    const minH = 60;
    const maxH = arenaH - PIPE_GAP - 80;
    const topH = Math.floor(minH + Math.random() * (maxH - minH));
    const bottomY = topH + PIPE_GAP;

    const pipe = {
      x: startX || arenaW + 40,
      width: PIPE_WIDTH,
      topH: topH,
      bottomY: bottomY,
      passed: false
    };
    pipes.push(pipe);

    // Spawn a collectible in between the gap or just past it
    const types = [
      { icon: "⭐", points: 2, label: "+2 ⭐" },
      { icon: "🎁", points: 3, label: "+3 🎁" },
      { icon: "💎", points: 5, label: "+5 💎" },
      { icon: "💙", points: 2, label: "+2 💙" }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];

    collectibles.push({
      x: pipe.x + PIPE_WIDTH / 2,
      y: topH + PIPE_GAP / 2 + (Math.random() * 40 - 20),
      icon: chosen.icon,
      points: chosen.points,
      label: chosen.label,
      r: 16,
      collected: false,
      seed: Math.random() * 10
    });
  }

  // Flap jump action
  function flap() {
    if (gameState === "IDLE") {
      startFlappyGame();
      return;
    }
    if (gameState === "GAMEOVER") {
      restartFlappyGame();
      return;
    }
    if (gameState !== "PLAYING") return;

    player.vy = player.jumpPower;
    player.isFlapping = true;
    player.wingPhase += 1.2;
    playFlapSound();

    // Spawn puff of wing sparkles
    for (let i = 0; i < 6; i++) {
      player.trail.push({
        x: player.x - 10 + (Math.random() * 6 - 3),
        y: player.y + (Math.random() * 8 - 4),
        vx: -(Math.random() * 2 + 1),
        vy: (Math.random() * 2 - 1),
        r: Math.random() * 3 + 1.5,
        alpha: 1,
        color: Math.random() > 0.4 ? "#00f5d4" : "#fef08a"
      });
    }
  }

  function resetCakeCeremony() {
    hasUnlockedCake = false;
    hasBlownCandle = false;
    if (candleFlameElement) {
      candleFlameElement.style.display = "block";
      candleFlameElement.style.transform = "scale(1)";
      candleFlameElement.style.opacity = "1";
    }
    if (candleSmokePuff) candleSmokePuff.style.display = "none";
    if (btnTapBlowCandle) btnTapBlowCandle.style.display = "inline-flex";
    if (cakeRevealedLetter) cakeRevealedLetter.style.display = "none";
    if (gameCakeModal) gameCakeModal.style.display = "none";
  }

  // Start Playing
  function startFlappyGame() {
    resetCakeCeremony();
    gameState = "PLAYING";
    flappyScore = 0;
    updateFlappyHud();

    if (gameStartBanner) gameStartBanner.style.display = "none";
    if (gameOverBanner) gameOverBanner.style.display = "none";
    if (gameCakeModal) gameCakeModal.style.display = "none";

    player.y = arenaH / 2;
    player.vy = -3;
    player.angle = 0;
    player.trail = [];

    pipes = [];
    collectibles = [];
    particles = [];

    // Pre-spawn first 3 crystal pillars
    spawnPipe(arenaW + 80);
    spawnPipe(arenaW + 80 + PIPE_SPACING);
    spawnPipe(arenaW + 80 + PIPE_SPACING * 2);

    cancelAnimationFrame(animFrameId);
    loop();
  }

  function restartFlappyGame() {
    if (gameArena) gameArena.classList.remove("arena-shaking");
    startFlappyGame();
  }

  function pauseFlappyGame() {
    gameState = "IDLE";
    cancelAnimationFrame(animFrameId);
  }

  function startFlappyIdleLoop() {
    cancelAnimationFrame(animFrameId);
    gameState = "IDLE";
    if (gameStartBanner) gameStartBanner.style.display = "flex";
    if (gameOverBanner) gameOverBanner.style.display = "none";
    loop();
  }

  // Trigger Victory / Cake Ceremony Modal
  function triggerCakeUnlockCeremony() {
    hasUnlockedCake = true;
    startConfetti();
    playChime([523.25, 659.25, 783.99, 1046.50, 1318.51]);

    spawnFloatingWish(arenaW / 2, arenaH / 3, "🎉 KUE TERBUKA! SELAMAT ULANG TAHUN! 🎂");
    updateFlappyHud();

    // Show Cake modal after short delay and cleanly pause game to prevent accidental collision
    setTimeout(() => {
      cancelAnimationFrame(animFrameId);
      gameState = "IDLE";
      if (gameCakeModal) {
        gameCakeModal.style.display = "flex";
      }
    }, 1200);
  }

  // Game Over Handler
  function triggerFlappyGameOver() {
    gameState = "GAMEOVER";
    playHitSound();

    if (gameArena) {
      gameArena.classList.add("arena-shaking");
      setTimeout(() => gameArena.classList.remove("arena-shaking"), 450);
    }

    if (flappyScore > flappyBestScore) {
      flappyBestScore = flappyScore;
      localStorage.setItem("ultah_flappy_best", flappyBestScore.toString());
    }

    updateFlappyHud();

    if (gameOverScore) gameOverScore.textContent = flappyScore;
    if (gameOverBest) gameOverBest.textContent = flappyBestScore;

    if (btnOpenCakeAnyway) {
      btnOpenCakeAnyway.style.display = (hasUnlockedCake || flappyScore >= TARGET_GOAL_SCORE) ? "inline-flex" : "none";
    }

    if (gameOverHint) {
      if (flappyScore >= TARGET_GOAL_SCORE) {
        gameOverHint.textContent = "Hebat banget! Kue kejutan sudah terbuka, kamu bisa meniup lilinnya sekarang! 🎂✨";
      } else {
        const left = TARGET_GOAL_SCORE - flappyScore;
        gameOverHint.textContent = `Tinggal ${left} poin lagi menuju kue ulang tahun! Coba sekali lagi yaa 💙`;
      }
    }

    setTimeout(() => {
      if (gameOverBanner) gameOverBanner.style.display = "flex";
    }, 350);
  }

  // Drawing procedural glowing butterfly
  function drawButterfly(ctx, x, y, angle, wingPhase) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const flapScale = Math.cos(wingPhase); // -1 to 1 oscillation
    const wingWidth = 24 * (0.35 + 0.65 * Math.abs(flapScale));

    // Outer glow
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#00f5d4";

    // Left Wings (Top & Bottom)
    ctx.save();
    ctx.beginPath();
    const gradL = ctx.createLinearGradient(-wingWidth, -20, 0, 10);
    gradL.addColorStop(0, "#00f5d4");
    gradL.addColorStop(0.5, "#0284c7");
    gradL.addColorStop(1, "#38bdf8");
    ctx.fillStyle = gradL;

    // Top Left Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-wingWidth * 0.8, -26, -wingWidth * 1.3, -12, -wingWidth, 2);
    ctx.bezierCurveTo(-wingWidth * 0.6, 10, -wingWidth * 0.2, 5, 0, 0);
    ctx.fill();

    // Bottom Left Wing
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(-wingWidth * 0.9, 8, -wingWidth * 0.7, 22, -wingWidth * 0.3, 18);
    ctx.bezierCurveTo(-wingWidth * 0.1, 14, 0, 6, 0, 2);
    ctx.fill();

    // Left Wing Vein Accents
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-wingWidth * 0.7, -12);
    ctx.moveTo(0, 2);
    ctx.lineTo(-wingWidth * 0.5, 12);
    ctx.stroke();
    ctx.restore();

    // Right Wings (Top & Bottom)
    ctx.save();
    ctx.beginPath();
    const gradR = ctx.createLinearGradient(0, -20, wingWidth, 10);
    gradR.addColorStop(0, "#38bdf8");
    gradR.addColorStop(0.5, "#0284c7");
    gradR.addColorStop(1, "#00f5d4");
    ctx.fillStyle = gradR;

    // Top Right Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(wingWidth * 0.8, -26, wingWidth * 1.3, -12, wingWidth, 2);
    ctx.bezierCurveTo(wingWidth * 0.6, 10, wingWidth * 0.2, 5, 0, 0);
    ctx.fill();

    // Bottom Right Wing
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(wingWidth * 0.9, 8, wingWidth * 0.7, 22, wingWidth * 0.3, 18);
    ctx.bezierCurveTo(wingWidth * 0.1, 14, 0, 6, 0, 2);
    ctx.fill();

    // Right Wing Vein Accents
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(wingWidth * 0.7, -12);
    ctx.moveTo(0, 2);
    ctx.lineTo(wingWidth * 0.5, 12);
    ctx.stroke();
    ctx.restore();

    // Slender Body & Head
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.quadraticCurveTo(-6, -18, -8, -19);
    ctx.moveTo(0, -10);
    ctx.quadraticCurveTo(6, -18, 8, -19);
    ctx.stroke();

    // Antenna glowing tips
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(-8, -19, 1.6, 0, Math.PI * 2);
    ctx.arc(8, -19, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Glowing Crystal Pillar
  function drawCrystalPillar(ctx, x, topH, bottomY) {
    const w = PIPE_WIDTH;

    // Top Stalactite Crystal
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(0, 245, 212, 0.4)";

    // Top Column Body
    const topGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    topGrad.addColorStop(0, "rgba(8, 47, 73, 0.95)");
    topGrad.addColorStop(0.3, "rgba(2, 132, 199, 0.9)");
    topGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.85)");
    topGrad.addColorStop(1, "rgba(8, 47, 73, 0.95)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(x, 0, w, topH - 18);

    // Top Crystal Pointed Tip
    ctx.beginPath();
    ctx.moveTo(x, topH - 18);
    ctx.lineTo(x + w * 0.5, topH);
    ctx.lineTo(x + w, topH - 18);
    ctx.closePath();
    ctx.fill();

    // Highlights and facet lines
    ctx.strokeStyle = "rgba(0, 245, 212, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, 0, w, topH - 18);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, 0);
    ctx.lineTo(x + w * 0.5, topH);
    ctx.stroke();

    // Glowing Gem at tip
    ctx.fillStyle = "#00f5d4";
    ctx.beginPath();
    ctx.arc(x + w * 0.5, topH - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bottom Stalagmite Crystal
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(0, 245, 212, 0.4)";

    const botH = arenaH - bottomY;
    const botGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    botGrad.addColorStop(0, "rgba(8, 47, 73, 0.95)");
    botGrad.addColorStop(0.3, "rgba(2, 132, 199, 0.9)");
    botGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.85)");
    botGrad.addColorStop(1, "rgba(8, 47, 73, 0.95)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(x, bottomY + 18, w, botH - 18);

    // Bottom Crystal Pointed Tip
    ctx.beginPath();
    ctx.moveTo(x, bottomY + 18);
    ctx.lineTo(x + w * 0.5, bottomY);
    ctx.lineTo(x + w, bottomY + 18);
    ctx.closePath();
    ctx.fill();

    // Highlights & runes
    ctx.strokeStyle = "rgba(0, 245, 212, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, bottomY + 18, w, botH - 18);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, bottomY);
    ctx.lineTo(x + w * 0.5, arenaH);
    ctx.stroke();

    // Glowing Gem at tip
    ctx.fillStyle = "#00f5d4";
    ctx.beginPath();
    ctx.arc(x + w * 0.5, bottomY + 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw Collectible Item (Star, Gift, Diamond, Heart)
  function drawCollectible(ctx, item) {
    ctx.save();
    const bob = Math.sin(frameCount * 0.08 + item.seed) * 5;
    const drawY = item.y + bob;

    // Glowing aura
    ctx.shadowBlur = 15;
    ctx.shadowColor = item.points >= 5 ? "#38bdf8" : "#fef08a";

    ctx.font = "26px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.icon, item.x, drawY);

    ctx.restore();
  }

  // Main Flappy Game Loop
  function loop() {
    if (!flappyCtx) return;
    frameCount++;

    // 1. Clear & Draw Parallax Ocean Deep Background
    flappyCtx.clearRect(0, 0, arenaW, arenaH);

    // Deep ocean gradient
    const bgGrad = flappyCtx.createLinearGradient(0, 0, 0, arenaH);
    bgGrad.addColorStop(0, "#030d22");
    bgGrad.addColorStop(0.7, "#051838");
    bgGrad.addColorStop(1, "#020a17");
    flappyCtx.fillStyle = bgGrad;
    flappyCtx.fillRect(0, 0, arenaW, arenaH);

    // Star particles in background
    flappyCtx.fillStyle = "#ffffff";
    for (let s of starsBg) {
      if (gameState === "PLAYING") {
        s.x -= s.speed;
        if (s.x < 0) s.x = arenaW;
      }
      flappyCtx.globalAlpha = s.alpha * (0.6 + 0.4 * Math.sin(frameCount * 0.05 + s.x));
      flappyCtx.beginPath();
      flappyCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      flappyCtx.fill();
    }
    flappyCtx.globalAlpha = 1;

    // 2. Physics & Logic Update
    if (gameState === "IDLE") {
      player.y = arenaH / 2 + Math.sin(frameCount * 0.06) * 12;
      player.angle = Math.sin(frameCount * 0.06) * 0.1;
      player.wingPhase += 0.18;
    } else if (gameState === "PLAYING") {
      player.vy += player.gravity;
      player.y += player.vy;

      // Smooth rotation angle
      player.targetAngle = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, player.vy * 0.08));
      player.angle += (player.targetAngle - player.angle) * 0.2;

      player.wingPhase += player.vy < 0 ? 0.35 : 0.15;

      // Ceiling & Floor Collision
      if (player.y - player.r <= 8) {
        player.y = 8 + player.r;
        player.vy = 0;
      }
      if (player.y + player.r >= arenaH - 12) {
        triggerFlappyGameOver();
      }

      // Update Pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= SCROLL_SPEED;

        // Check if passed for score
        if (!p.passed && p.x + p.width < player.x) {
          p.passed = true;
          flappyScore += 1;
          updateFlappyHud();
          playChime([784.00, 1046.50]); // Ping chime

          // Check Milestone
          if (flappyScore >= TARGET_GOAL_SCORE && !hasUnlockedCake) {
            triggerCakeUnlockCeremony();
          }
        }

        // Collision Check with Crystal Columns
        if (
          player.x + player.r - 3 > p.x &&
          player.x - player.r + 3 < p.x + p.width
        ) {
          if (
            player.y - player.r + 3 < p.topH ||
            player.y + player.r - 3 > p.bottomY
          ) {
            triggerFlappyGameOver();
          }
        }

        // Remove offscreen pipes
        if (p.x + p.width < -50) {
          pipes.splice(i, 1);
        }
      }

      // Spawn new pipe when needed
      const lastPipe = pipes[pipes.length - 1];
      if (lastPipe && lastPipe.x < arenaW + 40 - PIPE_SPACING) {
        spawnPipe(arenaW + 40);
      }

      // Update Collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        item.x -= SCROLL_SPEED;

        // Collision with player
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!item.collected && dist < player.r + item.r + 6) {
          item.collected = true;
          flappyScore += item.points;
          updateFlappyHud();
          playItemCollectSound(item.points);

          // Burst particles
          for (let k = 0; k < 12; k++) {
            particles.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              r: Math.random() * 3 + 2,
              alpha: 1,
              color: item.points >= 5 ? "#38bdf8" : "#fef08a"
            });
          }

          spawnFloatingWish(item.x, item.y, item.label);

          if (flappyScore >= TARGET_GOAL_SCORE && !hasUnlockedCake) {
            triggerCakeUnlockCeremony();
          }

          collectibles.splice(i, 1);
          continue;
        }

        if (item.x < -40) {
          collectibles.splice(i, 1);
        }
      }

      // Butterfly Stardust Trail
      player.trail.push({
        x: player.x - 12,
        y: player.y + (Math.random() * 6 - 3),
        vx: -SCROLL_SPEED * 0.6,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2.5 + 1,
        alpha: 0.9,
        color: Math.random() > 0.35 ? "#00f5d4" : "#38bdf8"
      });
    }

    // 3. Render Pipes
    for (const p of pipes) {
      drawCrystalPillar(flappyCtx, p.x, p.topH, p.bottomY);
    }

    // 4. Render Collectibles
    for (const item of collectibles) {
      drawCollectible(flappyCtx, item);
    }

    // 5. Render Stardust Trail & Particles
    for (let i = player.trail.length - 1; i >= 0; i--) {
      const pt = player.trail[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.025;
      if (pt.alpha <= 0) {
        player.trail.splice(i, 1);
        continue;
      }
      flappyCtx.save();
      flappyCtx.globalAlpha = pt.alpha;
      flappyCtx.fillStyle = pt.color;
      flappyCtx.shadowBlur = 8;
      flappyCtx.shadowColor = pt.color;
      flappyCtx.beginPath();
      flappyCtx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      flappyCtx.fill();
      flappyCtx.restore();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      flappyCtx.save();
      flappyCtx.globalAlpha = p.alpha;
      flappyCtx.fillStyle = p.color;
      flappyCtx.shadowBlur = 10;
      flappyCtx.shadowColor = p.color;
      flappyCtx.beginPath();
      flappyCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      flappyCtx.fill();
      flappyCtx.restore();
    }

    // 6. Render Butterfly
    drawButterfly(flappyCtx, player.x, player.y, player.angle, player.wingPhase);

    // 7. Ground Mist Light
    flappyCtx.save();
    const mistGrad = flappyCtx.createLinearGradient(0, arenaH - 24, 0, arenaH);
    mistGrad.addColorStop(0, "rgba(0, 245, 212, 0)");
    mistGrad.addColorStop(1, "rgba(0, 245, 212, 0.2)");
    flappyCtx.fillStyle = mistGrad;
    flappyCtx.fillRect(0, arenaH - 24, arenaW, 24);
    flappyCtx.restore();

    // Next Frame
    if (gameState !== "GAMEOVER") {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  // Event Listeners for Controls
  function handleFlapInput(e) {
    if (!screens.game || !screens.game.classList.contains("active")) return;
    if (gameCakeModal && gameCakeModal.style.display === "flex") return;

    if (e.type === "keydown") {
      if (e.code === "Space" || e.key === " " || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    } else {
      flap();
    }
  }

  flappyCanvas?.addEventListener("pointerdown", handleFlapInput);
  btnMobileFlap?.addEventListener("pointerdown", handleFlapInput);
  btnStartGameNow?.addEventListener("click", startFlappyGame);
  btnRestartGame?.addEventListener("click", restartFlappyGame);

  btnOpenCakeAnyway?.addEventListener("click", () => {
    if (gameCakeModal) gameCakeModal.style.display = "flex";
  });

  window.addEventListener("keydown", handleFlapInput);

  // Cake Ceremony Logic
  function blowBirthdayCandle() {
    if (hasBlownCandle) return;
    hasBlownCandle = true;

    if (candleFlameElement) {
      candleFlameElement.style.transition = "transform 0.25s ease, opacity 0.25s ease";
      candleFlameElement.style.transform = "scale(0)";
      candleFlameElement.style.opacity = "0";
      setTimeout(() => {
        candleFlameElement.style.display = "none";
      }, 250);
    }

    if (candleSmokePuff) {
      candleSmokePuff.style.display = "block";
      candleSmokePuff.textContent = "💨 ✨ 🤍";
    }

    startConfetti();
    playChime([659.25, 783.99, 987.77, 1318.51, 1567.98]);

    if (btnTapBlowCandle) {
      btnTapBlowCandle.style.display = "none";
    }

    setTimeout(() => {
      if (cakeRevealedLetter) {
        cakeRevealedLetter.style.display = "block";
      }
    }, 500);
  }

  celebrationCandle?.addEventListener("click", blowBirthdayCandle);
  btnTapBlowCandle?.addEventListener("click", blowBirthdayCandle);

  btnGameReplay?.addEventListener("click", () => {
    resetCakeCeremony();
    startFlappyGame();
  });

  document.querySelectorAll(".btn-ceremony-menu").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (gameCakeModal) gameCakeModal.style.display = "none";
      pauseFlappyGame();
      showScreen("menu");
    });
  });

  // ==========================================
  // 5. POLAROID LIGHTBOX (Supports both Journey & Moment)
  // ==========================================
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeLightboxBtn = document.getElementById("btn-close-lightbox");

  document.querySelectorAll(".ref-polaroid, .polaroid-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.getAttribute("data-index") || "0", 10);
      const momentData = (appData.moments && appData.moments[idx % appData.moments.length]) || {
        title: "Sweet Memory",
        caption: "Kenangan indah bersamamu ✨",
        photo: card.querySelector("img")?.src || "assets/portrait1.jpg"
      };

      const imgSrc = card.querySelector("img")?.src || momentData.photo;
      lightboxImg.src = imgSrc;
      lightboxTitle.textContent = momentData.title;
      lightboxCaption.textContent = momentData.caption;

      playChime([587.33, 739.99]);
      lightboxModal.classList.add("active");
    });
  });

  closeLightboxBtn?.addEventListener("click", () => {
    lightboxModal.classList.remove("active");
  });

  lightboxModal?.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove("active");
    }
  });

  // ==========================================
  // 6. SCREEN 4: PLAYLIST INTERACTION
  // ==========================================
  const playPauseBtn = document.getElementById("btn-player-play-pause");
  playPauseBtn?.addEventListener("click", () => {
    toggleMusic();
  });

  const miniVinylPlayBtn = document.getElementById("btn-mini-vinyl-play");
  miniVinylPlayBtn?.addEventListener("click", () => {
    toggleMusic();
  });

  // Progress Bar Simulation
  let progressPct = 35;
  setInterval(() => {
    if (isMusicPlaying) {
      progressPct = (progressPct + 0.4) % 100;
      const fill = document.getElementById("track-progress-fill");
      if (fill) fill.style.width = `${progressPct}%`;

      const totalSeconds = Math.floor((progressPct / 100) * 225);
      const min = Math.floor(totalSeconds / 60);
      const sec = String(totalSeconds % 60).padStart(2, "0");
      const timeDisplay = document.getElementById("time-display");
      if (timeDisplay) timeDisplay.textContent = `${min}:${sec} / 3:45`;
    }
  }, 1000);

  // Toggle YouTube Embed Option
  const btnYtToggle = document.getElementById("btn-yt-toggle");
  const visualizerContent = document.getElementById("visualizer-content");
  const ytEmbedBox = document.getElementById("yt-embed-box");
  const ytPlayerFrame = document.getElementById("yt-player-frame");
  let isYtVisible = false;

  btnYtToggle?.addEventListener("click", () => {
    isYtVisible = !isYtVisible;
    if (isYtVisible) {
      const ytId = appData.playlist?.youtubeId || "dviEPYzH3gg";
      ytPlayerFrame.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      visualizerContent.style.display = "none";
      ytEmbedBox.style.display = "block";
      btnYtToggle.textContent = "🦋 Switch to Visualizer";
      stopLofiBackgroundMusic();
    } else {
      ytPlayerFrame.src = "";
      ytEmbedBox.style.display = "none";
      visualizerContent.style.display = "flex";
      btnYtToggle.textContent = "📺 YouTube";
    }
  });

  // Butterfly Click Sound & Light Shimmer
  const cameraEl = document.getElementById("camera-click-sound");
  cameraEl?.addEventListener("click", () => {
    playChime([783.99, 987.77, 1174.66]);
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.backgroundColor = "rgba(0, 245, 212, 0.4)";
    flash.style.zIndex = "9999";
    flash.style.transition = "opacity 0.4s ease";
    flash.style.pointerEvents = "none";
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 400);
    }, 50);
  });

  // ==========================================
  // 7. SCREEN 5: UNWRAP GIFT & CONFETTI
  // ==========================================
  const unwrapGiftBtn = document.getElementById("btn-unwrap-gift");
  const giftModal = document.getElementById("gift-reveal-modal");
  const closeVoucherBtn = document.getElementById("btn-close-voucher");

  unwrapGiftBtn?.addEventListener("click", () => {
    playChime([587.33, 739.99, 880.00, 1174.66, 1479.98]);
    giftModal.classList.add("active");
    startConfetti();
  });

  closeVoucherBtn?.addEventListener("click", () => {
    giftModal.classList.remove("active");
  });

  giftModal?.addEventListener("click", (e) => {
    if (e.target === giftModal) {
      giftModal.classList.remove("active");
    }
  });

  // Confetti Animation on Gift Reveal
  function startConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const colors = ["#00f5d4", "#38bdf8", "#0284c7", "#ffffff", "#bae6fd", "#7dd3fc"];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    let animId;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(animId);
      }
    }

    renderConfetti();
  }

  // ==========================================
  // 8. AMBIENT PARTICLES (GLOWING BUTTERFLIES & STARDUST)
  // ==========================================
  const ambientCanvas = document.getElementById("ambient-canvas");
  if (ambientCanvas) {
    const aCtx = ambientCanvas.getContext("2d");

    function resizeCanvas() {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ambientParticles = [];
    const pCount = 38;

    for (let i = 0; i < pCount; i++) {
      ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        isButterfly: Math.random() > 0.65,
        wingPhase: Math.random() * Math.PI * 2
      });
    }

    function renderAmbient() {
      aCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

      ambientParticles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.wingPhase += 0.08;

        if (p.y < -25) {
          p.y = ambientCanvas.height + 25;
          p.x = Math.random() * ambientCanvas.width;
        }

        aCtx.save();
        aCtx.globalAlpha = p.alpha;

        if (p.isButterfly) {
          // Render glowing vector morpho butterfly with sinusoidal natural fluttering
          p.x += Math.sin(p.wingPhase * 1.8) * 0.75;
          const flap = Math.abs(Math.cos(p.wingPhase * 2.6));
          const bW = 12 * Math.max(0.18, flap);
          const bH = 10;

          aCtx.save();
          aCtx.translate(p.x, p.y);
          aCtx.rotate(Math.sin(p.wingPhase) * 0.28 - 0.08);
          aCtx.shadowBlur = 14;
          aCtx.shadowColor = "#00f5d4";

          // Left Wing
          aCtx.fillStyle = "#00f5d4";
          aCtx.beginPath();
          aCtx.ellipse(-bW * 0.45, -1, bW * 0.5, bH * 0.5, -0.28, 0, Math.PI * 2);
          aCtx.fill();

          // Right Wing
          aCtx.beginPath();
          aCtx.ellipse(bW * 0.45, -1, bW * 0.5, bH * 0.5, 0.28, 0, Math.PI * 2);
          aCtx.fill();

          // Slender Body Highlight
          aCtx.fillStyle = "#ffffff";
          aCtx.beginPath();
          aCtx.ellipse(0, 0, 1.1, 4.5, 0, 0, Math.PI * 2);
          aCtx.fill();

          aCtx.restore();
        } else {
          aCtx.fillStyle = "#ffffff";
          aCtx.shadowBlur = 8;
          aCtx.shadowColor = "#38bdf8";
          aCtx.beginPath();
          aCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          aCtx.fill();
        }

        aCtx.restore();
      });

      requestAnimationFrame(renderAmbient);
    }
    renderAmbient();
  }

  // ==========================================
  // 8B. INTERACTIVE LANDING BUTTERFLIES & STARDUST
  // ==========================================
  const landingScreen = document.getElementById("screen-landing");
  if (landingScreen) {
    let lastSparkle = 0;

    landingScreen.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - lastSparkle > 60) {
        lastSparkle = now;
        spawnLandingSparkle(e.clientX, e.clientY);
      }
    });

    landingScreen.addEventListener("click", (e) => {
      if (e.target.closest("#btn-tap-surprise") || e.target.closest(".audio-control-container")) return;
      spawnClickButterflyBurst(e.clientX, e.clientY);
    });
  }

  function spawnLandingSparkle(x, y) {
    const spark = document.createElement("div");
    spark.className = "interactive-sparkle";
    spark.style.cssText = `
      position: fixed;
      left: ${x + (Math.random() - 0.5) * 12}px;
      top: ${y + (Math.random() - 0.5) * 12}px;
      width: ${Math.random() * 5 + 3}px;
      height: ${Math.random() * 5 + 3}px;
      border-radius: 50%;
      background: #00f5d4;
      box-shadow: 0 0 10px #00f5d4, 0 0 20px #38bdf8;
      pointer-events: none;
      z-index: 99;
      opacity: 0.9;
      transition: transform 0.6s ease-out, opacity 0.6s ease-out;
    `;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${(Math.random() - 0.5) * 35}px, ${-Math.random() * 25 - 10}px) scale(0)`;
      spark.style.opacity = "0";
    });
    setTimeout(() => spark.remove(), 650);
  }

  function spawnClickButterflyBurst(x, y) {
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const miniB = document.createElement("div");
      miniB.className = "perched-bf3d";
      miniB.innerHTML = `
        <div class="wing-left"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
        <div class="bf3d-body"><div class="bf3d-antennae"></div></div>
        <div class="wing-right"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
      `;
      const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = Math.random() * 90 + 70;
      const targetX = x + Math.cos(angle) * dist;
      const targetY = y + Math.sin(angle) * dist;

      miniB.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 32px;
        height: 26px;
        margin-left: -16px;
        margin-top: -13px;
        pointer-events: none;
        z-index: 100;
        filter: drop-shadow(0 0 12px #00f5d4);
        opacity: 1;
        transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease;
        transform: translate(0, 0) scale(0.4) rotate(${angle * 180 / Math.PI}deg);
      `;
      document.body.appendChild(miniB);

      requestAnimationFrame(() => {
        miniB.style.transform = `translate(${targetX - x}px, ${targetY - y}px) scale(1.15) rotate(${angle * 180 / Math.PI}deg)`;
        miniB.style.opacity = "0";
      });
      setTimeout(() => miniB.remove(), 800);
    }
  }

  // ==========================================
  // 8C. GLOBAL ULTRA-SMOOTH FLYING BUTTERFLIES ENGINE & STARDUST TRAIL
  // Active across ALL pages and entire viewport
  // ==========================================
  function initGlobalFlyingButterfliesEngine() {
    const container = document.getElementById("global-flying-butterflies");
    const trailCanvas = document.getElementById("butterfly-trail-canvas");
    if (!container || !trailCanvas) return;

    const tCtx = trailCanvas.getContext("2d");

    function resizeTrailCanvas() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    resizeTrailCanvas();
    window.addEventListener("resize", resizeTrailCanvas);

    // 5 Unique Morpho Butterflies with varying sizes, speeds & flight styles
    const butterflyConfigs = [
      { id: 1, w: 62, h: 52, baseSpeed: 2.2, turnRate: 0.040, flapFreq: 0.16, scale: 1.05 },
      { id: 2, w: 52, h: 44, baseSpeed: 2.6, turnRate: 0.048, flapFreq: 0.18, scale: 0.95 },
      { id: 3, w: 42, h: 36, baseSpeed: 3.0, turnRate: 0.052, flapFreq: 0.22, scale: 0.85 },
      { id: 4, w: 56, h: 48, baseSpeed: 2.0, turnRate: 0.038, flapFreq: 0.15, scale: 1.0 },
      { id: 5, w: 38, h: 32, baseSpeed: 2.8, turnRate: 0.050, flapFreq: 0.20, scale: 0.8 }
    ];

    container.innerHTML = "";
    const butterflies = [];

    butterflyConfigs.forEach((cfg, idx) => {
      const el = document.createElement("div");
      el.className = "global-bf3d";
      el.style.width = `${cfg.w}px`;
      el.style.height = `${cfg.h}px`;
      el.innerHTML = `
        <div class="global-bf3d-assembly">
          <div class="global-bf3d-glow"></div>
          <div class="wing-left"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
          <div class="bf3d-body"><div class="bf3d-antennae"></div></div>
          <div class="wing-right"><svg viewBox="0 0 80 102" class="wing-svg"><use href="#svg-morpho-wing"/></svg></div>
        </div>
      `;
      container.appendChild(el);

      const startAngle = (idx / butterflyConfigs.length) * Math.PI * 2;
      const margin = 120;
      const posX = margin + Math.random() * (window.innerWidth - margin * 2);
      const posY = margin + Math.random() * (window.innerHeight - margin * 2);

      butterflies.push({
        el,
        w: cfg.w,
        h: cfg.h,
        x: posX,
        y: posY,
        angle: startAngle,
        targetAngle: startAngle,
        speed: cfg.baseSpeed,
        baseSpeed: cfg.baseSpeed,
        turnRate: cfg.turnRate,
        flapFreq: cfg.flapFreq,
        scale: cfg.scale,
        bank: 0,
        wingPhase: Math.random() * Math.PI * 2,
        noiseSeed: Math.random() * 1000 + idx * 250,
        tailPoints: [] // for ethereal streamer ribbon
      });
    });

    // Particle Trail Pool
    const trailParticles = [];
    const MAX_PARTICLES = 160;

    let mouseX = -9999;
    let mouseY = -9999;
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderGlobalButterflies() {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // 1. Clear Trail Canvas
      tCtx.clearRect(0, 0, screenW, screenH);

      // 2. Update and Draw Butterflies
      butterflies.forEach((b) => {
        b.noiseSeed += 0.009;

        // Smooth Natural Steering (Perlin-like continuous sinusoidal waves)
        const naturalTurn = Math.sin(b.noiseSeed) * 0.9 + Math.cos(b.noiseSeed * 0.6) * 0.5;

        // Soft screen border avoidance (smoothly repels without hard walls)
        const margin = 110;
        let borderForceX = 0;
        let borderForceY = 0;

        if (b.x < margin) borderForceX = (margin - b.x) / margin;
        if (b.x > screenW - margin) borderForceX = -(b.x - (screenW - margin)) / margin;
        if (b.y < margin) borderForceY = (margin - b.y) / margin;
        if (b.y > screenH - margin) borderForceY = -(b.y - (screenH - margin)) / margin;

        // Gentle cursor avoidance (feels alive)
        const distToMouse = Math.hypot(b.x - mouseX, b.y - mouseY);
        let avoidForceX = 0;
        let avoidForceY = 0;
        if (distToMouse < 140) {
          const push = (140 - distToMouse) / 140;
          avoidForceX = ((b.x - mouseX) / distToMouse) * push * 1.5;
          avoidForceY = ((b.y - mouseY) / distToMouse) * push * 1.5;
        }

        // Desired direction combination
        let desiredAngle = b.angle + naturalTurn * 0.08;

        if (Math.hypot(borderForceX, borderForceY) > 0.05) {
          const steerAngle = Math.atan2(borderForceY, borderForceX);
          desiredAngle = steerAngle;
        } else if (Math.hypot(avoidForceX, avoidForceY) > 0.1) {
          desiredAngle = Math.atan2(avoidForceY, avoidForceX);
        }

        b.targetAngle = desiredAngle;

        // Shortest angular difference interpolation (slerp)
        let diff = b.targetAngle - b.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        b.angle += diff * b.turnRate;

        // Dynamic speed: gentle cruising, slight acceleration in turns
        b.speed = b.baseSpeed * (1 + Math.abs(diff) * 0.4);

        // Position update
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        // Hard clamp protection against edge overshoot
        b.x = Math.max(15, Math.min(screenW - 15, b.x));
        b.y = Math.max(15, Math.min(screenH - 15, b.y));

        // Wing flapping & flight undulation
        b.wingPhase += b.flapFreq;
        const undulation = Math.sin(b.wingPhase) * 1.6;

        // 3D Banking Roll (proportional to turn curvature)
        const targetBank = Math.max(-35, Math.min(35, diff * 42));
        b.bank += (targetBank - b.bank) * 0.12;

        // Transform DOM element in 3D
        const visualDeg = (b.angle * 180 / Math.PI) + 90;
        b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2 + undulation}px, 0) rotate(${visualDeg}deg) rotateZ(${b.bank}deg) scale(${b.scale})`;

        // Emit Tail Stardust Particles
        const tailDist = b.w * 0.38;
        const tailX = b.x - Math.cos(b.angle) * tailDist;
        const tailY = b.y - Math.sin(b.angle) * tailDist;

        // Keep recent tail points for smooth light ribbon
        b.tailPoints.push({ x: tailX, y: tailY });
        if (b.tailPoints.length > 9) b.tailPoints.shift();

        // Emit 1-2 particles every frame
        if (trailParticles.length < MAX_PARTICLES) {
          const colors = ["#00f5d4", "#38bdf8", "#ffffff", "#7dd3fc", "#a7f3d0"];
          const col = colors[Math.floor(Math.random() * colors.length)];
          const isStar = Math.random() > 0.82;

          trailParticles.push({
            x: tailX + (Math.random() - 0.5) * 6,
            y: tailY + (Math.random() - 0.5) * 6,
            vx: -Math.cos(b.angle) * 0.4 + (Math.random() - 0.5) * 0.6,
            vy: -Math.sin(b.angle) * 0.4 + (Math.random() - 0.5) * 0.6 + 0.15,
            size: isStar ? (Math.random() * 3 + 2.5) : (Math.random() * 2.2 + 1.2),
            alpha: 0.95,
            decay: Math.random() * 0.02 + 0.015,
            color: col,
            isStar: isStar,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08
          });
        }
      });

      // 3. Draw Fading Streamer Ribbons behind butterflies
      butterflies.forEach((b) => {
        if (b.tailPoints.length < 3) return;
        tCtx.save();
        tCtx.beginPath();
        tCtx.moveTo(b.tailPoints[0].x, b.tailPoints[0].y);
        for (let i = 1; i < b.tailPoints.length; i++) {
          tCtx.lineTo(b.tailPoints[i].x, b.tailPoints[i].y);
        }
        tCtx.strokeStyle = "rgba(0, 245, 212, 0.28)";
        tCtx.lineWidth = 1.8;
        tCtx.shadowBlur = 10;
        tCtx.shadowColor = "#00f5d4";
        tCtx.lineCap = "round";
        tCtx.lineJoin = "round";
        tCtx.stroke();
        tCtx.restore();
      });

      // 4. Update and Draw Stardust Particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        tCtx.save();
        tCtx.globalAlpha = p.alpha;
        tCtx.fillStyle = p.color;
        tCtx.shadowBlur = 8;
        tCtx.shadowColor = p.color;

        if (p.isStar) {
          // Draw 4-point twinkle star
          tCtx.translate(p.x, p.y);
          tCtx.rotate(p.rotation);
          tCtx.beginPath();
          const rOuter = p.size;
          const rInner = p.size * 0.35;
          for (let s = 0; s < 4; s++) {
            const rot = (s * Math.PI) / 2;
            tCtx.lineTo(Math.cos(rot) * rOuter, Math.sin(rot) * rOuter);
            tCtx.lineTo(Math.cos(rot + Math.PI / 4) * rInner, Math.sin(rot + Math.PI / 4) * rInner);
          }
          tCtx.closePath();
          tCtx.fill();
        } else {
          // Circular stardust glow dot
          tCtx.beginPath();
          tCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          tCtx.fill();
        }

        tCtx.restore();
      }

      requestAnimationFrame(renderGlobalButterflies);
    }

    renderGlobalButterflies();
  }

  // ==========================================
  // 9. STATIC DATA INITIALIZATION
  // ==========================================
  function syncDOMWithData() {
    const nameEl = document.getElementById("gift-person-name");
    if (nameEl) nameEl.textContent = appData.name;

    const cakeRecipient = document.getElementById("cake-recipient-name");
    if (cakeRecipient) cakeRecipient.textContent = `Selamat Ulang Tahun, ${appData.name}! 💙`;

    const dateEl = document.getElementById("landing-date-text");
    if (dateEl) dateEl.textContent = appData.birthDate;

    const letterEl = document.getElementById("gift-letter-body");
    if (letterEl) letterEl.textContent = appData.letterText;

    const titleEl = document.getElementById("player-song-title");
    if (titleEl) titleEl.textContent = appData.playlist?.songTitle || "Cinderella - Mac Miller";
  }

  syncDOMWithData();
  initGlobalFlyingButterfliesEngine();
});

