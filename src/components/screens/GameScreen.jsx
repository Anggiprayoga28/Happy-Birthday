import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playChime, initAudioContext } from '../../utils/audio';

const TARGET_GOAL_SCORE = 15;
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

export function GameScreen({ config, onNavigate }) {
  const canvasRef = useRef(null);
  const arenaRef = useRef(null);
  const wishesLayerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('ultah_flappy_best') || '0', 10);
  });
  const [gameState, setGameState] = useState('IDLE'); // 'IDLE' | 'PLAYING' | 'GAMEOVER'
  const [isCakeModalOpen, setIsCakeModalOpen] = useState(false);
  const [hasBlownCandle, setHasBlownCandle] = useState(false);
  const [hasUnlockedCake, setHasUnlockedCake] = useState(false);

  // References for mutable game loop state to avoid React re-render lag
  const gameLoopRef = useRef({
    gameState: 'IDLE',
    score: 0,
    bestScore: 0,
    hasUnlockedCake: false,
    animFrameId: null,
    arenaW: 800,
    arenaH: 480,
    dpr: 1,
    frameCount: 0,
    player: {
      x: 120,
      y: 220,
      r: 14,
      vy: 0,
      gravity: 0.35,
      jumpPower: -6.5,
      angle: 0,
      targetAngle: 0,
      wingPhase: 0,
      trail: [],
    },
    pipes: [],
    collectibles: [],
    particles: [],
    starsBg: [],
  });

  // Sound effects
  const playFlapSound = () => {
    const audioCtx = initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {}
  };

  const playHitSound = () => {
    const audioCtx = initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.26);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.27);
    } catch (e) {}
  };

  const spawnFloatingWish = (x, y, text) => {
    if (!wishesLayerRef.current) return;
    const wishEl = document.createElement('div');
    wishEl.className = 'floating-wish-tag';
    wishEl.textContent = text || SWEET_WISHES[Math.floor(Math.random() * SWEET_WISHES.length)];
    wishEl.style.left = `${x}px`;
    wishEl.style.top = `${y}px`;
    wishesLayerRef.current.appendChild(wishEl);
    setTimeout(() => {
      wishEl.remove();
    }, 1600);
  };

  const spawnPipe = (startX) => {
    const g = gameLoopRef.current;
    const minH = 60;
    const maxH = g.arenaH - PIPE_GAP - 80;
    const topH = Math.floor(minH + Math.random() * (maxH - minH));
    const bottomY = topH + PIPE_GAP;

    g.pipes.push({
      x: startX || g.arenaW + 40,
      width: PIPE_WIDTH,
      topH,
      bottomY,
      passed: false,
    });

    const types = [
      { icon: '⭐', points: 2, label: '+2 ⭐' },
      { icon: '🎁', points: 3, label: '+3 🎁' },
      { icon: '💎', points: 5, label: '+5 💎' },
      { icon: '💙', points: 2, label: '+2 💙' },
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];

    g.collectibles.push({
      x: (startX || g.arenaW + 40) + PIPE_WIDTH / 2,
      y: topH + PIPE_GAP / 2 + (Math.random() * 40 - 20),
      icon: chosen.icon,
      points: chosen.points,
      label: chosen.label,
      r: 16,
      collected: false,
      seed: Math.random() * 10,
    });
  };

  const flap = () => {
    const g = gameLoopRef.current;
    if (g.gameState === 'IDLE') {
      startGame();
      return;
    }
    if (g.gameState === 'GAMEOVER') {
      restartGame();
      return;
    }
    if (g.gameState !== 'PLAYING') return;

    g.player.vy = g.player.jumpPower;
    g.player.wingPhase += 1.2;
    playFlapSound();

    for (let i = 0; i < 6; i++) {
      g.player.trail.push({
        x: g.player.x - 10 + (Math.random() * 6 - 3),
        y: g.player.y + (Math.random() * 8 - 4),
        vx: -(Math.random() * 2 + 1),
        vy: Math.random() * 2 - 1,
        r: Math.random() * 3 + 1.5,
        alpha: 1,
        color: Math.random() > 0.4 ? '#00f5d4' : '#fef08a',
      });
    }
  };

  const triggerCakeUnlock = () => {
    const g = gameLoopRef.current;
    g.hasUnlockedCake = true;
    setHasUnlockedCake(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5d4', '#38bdf8', '#fef08a'],
      });
    } catch (e) {}

    playChime([523.25, 659.25, 783.99, 1046.5, 1318.51]);
    spawnFloatingWish(g.arenaW / 2, g.arenaH / 3, '🎉 KUE TERBUKA! SELAMAT ULANG TAHUN! 🎂');

    setTimeout(() => {
      cancelAnimationFrame(g.animFrameId);
      g.gameState = 'IDLE';
      setGameState('IDLE');
      setIsCakeModalOpen(true);
    }, 1200);
  };

  const triggerGameOver = () => {
    const g = gameLoopRef.current;
    g.gameState = 'GAMEOVER';
    setGameState('GAMEOVER');
    playHitSound();

    if (arenaRef.current) {
      arenaRef.current.classList.add('arena-shaking');
      setTimeout(() => arenaRef.current?.classList.remove('arena-shaking'), 450);
    }

    if (g.score > g.bestScore) {
      g.bestScore = g.score;
      setBestScore(g.score);
      localStorage.setItem('ultah_flappy_best', g.score.toString());
    }
  };

  const startGame = () => {
    const g = gameLoopRef.current;
    g.gameState = 'PLAYING';
    g.score = 0;
    g.player.y = g.arenaH / 2;
    g.player.vy = -3;
    g.player.angle = 0;
    g.player.trail = [];
    g.pipes = [];
    g.collectibles = [];
    g.particles = [];

    setScore(0);
    setGameState('PLAYING');
    setIsCakeModalOpen(false);

    spawnPipe(g.arenaW + 80);
    spawnPipe(g.arenaW + 80 + PIPE_SPACING);
    spawnPipe(g.arenaW + 80 + PIPE_SPACING * 2);

    cancelAnimationFrame(g.animFrameId);
    loop();
  };

  const restartGame = () => {
    startGame();
  };

  const blowCandle = () => {
    if (hasBlownCandle) return;
    setHasBlownCandle(true);

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#00f5d4', '#38bdf8', '#ffd166', '#ff70a6', '#ffffff'],
      });
    } catch (e) {}

    playChime([659.25, 783.99, 987.77, 1318.51, 1567.98]);
  };

  // Drawing helpers
  const drawButterfly = (ctx, x, y, angle, wingPhase) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const flapScale = Math.cos(wingPhase);
    const wingWidth = 24 * (0.35 + 0.65 * Math.abs(flapScale));

    ctx.shadowBlur = 16;
    ctx.shadowColor = '#00f5d4';

    // Left Wing
    ctx.save();
    ctx.beginPath();
    const gradL = ctx.createLinearGradient(-wingWidth, -20, 0, 10);
    gradL.addColorStop(0, '#00f5d4');
    gradL.addColorStop(0.5, '#0284c7');
    gradL.addColorStop(1, '#38bdf8');
    ctx.fillStyle = gradL;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-wingWidth * 0.8, -26, -wingWidth * 1.3, -12, -wingWidth, 2);
    ctx.bezierCurveTo(-wingWidth * 0.6, 10, -wingWidth * 0.2, 5, 0, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(-wingWidth * 0.9, 8, -wingWidth * 0.7, 22, -wingWidth * 0.3, 18);
    ctx.bezierCurveTo(-wingWidth * 0.1, 14, 0, 6, 0, 2);
    ctx.fill();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.beginPath();
    const gradR = ctx.createLinearGradient(0, -20, wingWidth, 10);
    gradR.addColorStop(0, '#38bdf8');
    gradR.addColorStop(0.5, '#0284c7');
    gradR.addColorStop(1, '#00f5d4');
    ctx.fillStyle = gradR;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(wingWidth * 0.8, -26, wingWidth * 1.3, -12, wingWidth, 2);
    ctx.bezierCurveTo(wingWidth * 0.6, 10, wingWidth * 0.2, 5, 0, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(wingWidth * 0.9, 8, wingWidth * 0.7, 22, wingWidth * 0.3, 18);
    ctx.bezierCurveTo(wingWidth * 0.1, 14, 0, 6, 0, 2);
    ctx.fill();
    ctx.restore();

    // Body
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawCrystalPillar = (ctx, x, topH, bottomY) => {
    const g = gameLoopRef.current;
    const w = PIPE_WIDTH;

    // Top Stalactite
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(0, 245, 212, 0.4)';

    const topGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    topGrad.addColorStop(0, 'rgba(8, 47, 73, 0.95)');
    topGrad.addColorStop(0.3, 'rgba(2, 132, 199, 0.9)');
    topGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.85)');
    topGrad.addColorStop(1, 'rgba(8, 47, 73, 0.95)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(x, 0, w, topH - 18);

    ctx.beginPath();
    ctx.moveTo(x, topH - 18);
    ctx.lineTo(x + w * 0.5, topH);
    ctx.lineTo(x + w, topH - 18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 245, 212, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, 0, w, topH - 18);

    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.arc(x + w * 0.5, topH - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bottom Stalagmite
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(0, 245, 212, 0.4)';

    const botH = g.arenaH - bottomY;
    const botGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    botGrad.addColorStop(0, 'rgba(8, 47, 73, 0.95)');
    botGrad.addColorStop(0.3, 'rgba(2, 132, 199, 0.9)');
    botGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.85)');
    botGrad.addColorStop(1, 'rgba(8, 47, 73, 0.95)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(x, bottomY + 18, w, botH - 18);

    ctx.beginPath();
    ctx.moveTo(x, bottomY + 18);
    ctx.lineTo(x + w * 0.5, bottomY);
    ctx.lineTo(x + w, bottomY + 18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 245, 212, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, bottomY + 18, w, botH - 18);

    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.arc(x + w * 0.5, bottomY + 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawCollectible = (ctx, item) => {
    const g = gameLoopRef.current;
    ctx.save();
    const bob = Math.sin(g.frameCount * 0.08 + item.seed) * 5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = item.points >= 5 ? '#38bdf8' : '#fef08a';
    ctx.font = "26px 'Montserrat', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.icon, item.x, item.y + bob);
    ctx.restore();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const g = gameLoopRef.current;
    g.frameCount++;

    // 1. Clear background
    ctx.clearRect(0, 0, g.arenaW, g.arenaH);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, g.arenaH);
    bgGrad.addColorStop(0, '#030d22');
    bgGrad.addColorStop(0.7, '#051838');
    bgGrad.addColorStop(1, '#020a17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, g.arenaW, g.arenaH);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (const s of g.starsBg) {
      if (g.gameState === 'PLAYING') {
        s.x -= s.speed;
        if (s.x < 0) s.x = g.arenaW;
      }
      ctx.globalAlpha = s.alpha * (0.6 + 0.4 * Math.sin(g.frameCount * 0.05 + s.x));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 2. Physics & Logic Update
    if (g.gameState === 'IDLE') {
      g.player.y = g.arenaH / 2 + Math.sin(g.frameCount * 0.06) * 12;
      g.player.angle = Math.sin(g.frameCount * 0.06) * 0.1;
      g.player.wingPhase += 0.18;
    } else if (g.gameState === 'PLAYING') {
      g.player.vy += g.player.gravity;
      g.player.y += g.player.vy;
      g.player.targetAngle = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, g.player.vy * 0.08));
      g.player.angle += (g.player.targetAngle - g.player.angle) * 0.2;
      g.player.wingPhase += g.player.vy < 0 ? 0.35 : 0.15;

      if (g.player.y - g.player.r <= 8) {
        g.player.y = 8 + g.player.r;
        g.player.vy = 0;
      }
      if (g.player.y + g.player.r >= g.arenaH - 12) {
        triggerGameOver();
      }

      // Update Pipes
      for (let i = g.pipes.length - 1; i >= 0; i--) {
        const p = g.pipes[i];
        p.x -= SCROLL_SPEED;

        if (!p.passed && p.x + p.width < g.player.x) {
          p.passed = true;
          g.score += 1;
          setScore(g.score);
          playChime([784.0, 1046.5]);

          if (g.score >= TARGET_GOAL_SCORE && !g.hasUnlockedCake) {
            triggerCakeUnlock();
          }
        }

        // Collision Check
        if (
          g.player.x + g.player.r - 3 > p.x &&
          g.player.x - g.player.r + 3 < p.x + p.width
        ) {
          if (
            g.player.y - g.player.r + 3 < p.topH ||
            g.player.y + g.player.r - 3 > p.bottomY
          ) {
            triggerGameOver();
          }
        }

        if (p.x + p.width < -50) {
          g.pipes.splice(i, 1);
        }
      }

      // Spawn next pipe
      const lastPipe = g.pipes[g.pipes.length - 1];
      if (lastPipe && lastPipe.x < g.arenaW + 40 - PIPE_SPACING) {
        spawnPipe(g.arenaW + 40);
      }

      // Collectibles
      for (let i = g.collectibles.length - 1; i >= 0; i--) {
        const item = g.collectibles[i];
        item.x -= SCROLL_SPEED;

        const dx = g.player.x - item.x;
        const dy = g.player.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!item.collected && dist < g.player.r + item.r + 6) {
          item.collected = true;
          g.score += item.points;
          setScore(g.score);
          playChime([659.25, 880.0, 1174.66]);

          for (let k = 0; k < 12; k++) {
            g.particles.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              r: Math.random() * 3 + 2,
              alpha: 1,
              color: item.points >= 5 ? '#38bdf8' : '#fef08a',
            });
          }

          spawnFloatingWish(item.x, item.y, item.label);

          if (g.score >= TARGET_GOAL_SCORE && !g.hasUnlockedCake) {
            triggerCakeUnlock();
          }

          g.collectibles.splice(i, 1);
          continue;
        }

        if (item.x < -40) {
          g.collectibles.splice(i, 1);
        }
      }

      // Trail
      g.player.trail.push({
        x: g.player.x - 12,
        y: g.player.y + (Math.random() * 6 - 3),
        vx: -SCROLL_SPEED * 0.6,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2.5 + 1,
        alpha: 0.9,
        color: Math.random() > 0.35 ? '#00f5d4' : '#38bdf8',
      });
    }

    // 3. Render Pipes
    for (const p of g.pipes) {
      drawCrystalPillar(ctx, p.x, p.topH, p.bottomY);
    }

    // 4. Render Collectibles
    for (const item of g.collectibles) {
      drawCollectible(ctx, item);
    }

    // 5. Render Trail & Particles
    for (let i = g.player.trail.length - 1; i >= 0; i--) {
      const pt = g.player.trail[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.025;
      if (pt.alpha <= 0) {
        g.player.trail.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) {
        g.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Draw Butterfly
    drawButterfly(ctx, g.player.x, g.player.y, g.player.angle, g.player.wingPhase);

    // 7. Loop next frame
    if (g.gameState !== 'GAMEOVER') {
      g.animFrameId = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const arena = arenaRef.current;
    if (!canvas || !arena) return;

    const g = gameLoopRef.current;
    g.bestScore = bestScore;

    const handleResize = () => {
      g.dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.arenaW = arena.clientWidth || 800;
      g.arenaH = arena.clientHeight || 480;

      canvas.width = g.arenaW * g.dpr;
      canvas.height = g.arenaH * g.dpr;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(g.dpr, g.dpr);

      g.player.x = Math.max(90, Math.min(g.arenaW * 0.2, 140));

      if (g.starsBg.length === 0) {
        g.starsBg = [];
        for (let i = 0; i < 45; i++) {
          g.starsBg.push({
            x: Math.random() * g.arenaW,
            y: Math.random() * g.arenaH,
            r: Math.random() * 1.8 + 0.6,
            speed: Math.random() * 0.4 + 0.2,
            alpha: Math.random() * 0.7 + 0.3,
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Start in IDLE floating state
    g.animFrameId = requestAnimationFrame(loop);

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(g.animFrameId);
    };
  }, []);

  const progressPercent = Math.min(100, (score / TARGET_GOAL_SCORE) * 100);

  return (
    <section id="screen-game" className="app-screen active w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col justify-between">
      {/* Back button to return to menu */}
      <div className="screen-nav-header p-4 sm:p-5 z-20">
        <button
          className="btn-back-retro cursor-pointer text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2"
          onClick={() => onNavigate('menu')}
        >
          BACK ◀
        </button>
      </div>

      <div className="birthday-game-stage flex-1 flex flex-col items-center justify-center px-2 sm:px-4 max-w-4xl mx-auto w-full pt-14 pb-8 sm:py-4 -mt-2 sm:-mt-4">
        {/* Game Top HUD */}
        <div className="game-hud-bar w-full flex items-center justify-between gap-2 sm:gap-4 mb-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#021b3d]/70 border border-cyan-neon/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,245,212,0.2)]">
          <div className="hud-item hud-score flex flex-col items-start min-w-[50px]">
            <span className="hud-label text-[9px] sm:text-[10px] uppercase tracking-wider text-sky-300 font-semibold">SKOR</span>
            <div className="hud-score-display flex items-baseline gap-1">
              <span className="score-number text-xl sm:text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,245,212,0.7)]">{score}</span>
              <span className="score-target text-[10px] sm:text-xs text-sky-300/80">/ {TARGET_GOAL_SCORE}</span>
            </div>
          </div>

          <div className="hud-progress-wrap flex-1 flex flex-col items-center max-w-md mx-1 sm:mx-2">
            <div className="hud-progress-meter w-full h-2.5 sm:h-3 bg-black/40 rounded-full border border-cyan-neon/40 overflow-hidden relative">
              <div
                className="progress-fill-bar h-full bg-gradient-to-r from-sky-400 to-cyan-neon rounded-full transition-all duration-300 shadow-[0_0_10px_#00f5d4]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-hint-text text-[10px] sm:text-[11px] text-sky-200 mt-1 text-center truncate max-w-full">
              {hasUnlockedCake || score >= TARGET_GOAL_SCORE
                ? '🎉 Kue Ulang Tahun Terbuka! 🎂'
                : `Kumpulkan ${TARGET_GOAL_SCORE - score} lagi ✨`}
            </span>
          </div>

          <div className="hud-item hud-best flex flex-col items-end min-w-[50px]">
            <span className="hud-label text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-300 font-semibold">BEST</span>
            <span className="score-number best-val text-xl sm:text-2xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(254,240,138,0.7)]">
              {bestScore}
            </span>
          </div>
        </div>

        {/* Main Game Arena */}
        <div
          ref={arenaRef}
          className="game-interactive-arena flappy-arena relative w-full h-[320px] sm:h-[390px] md:h-[440px] rounded-3xl overflow-hidden border-2 border-cyan-neon/50 shadow-[0_0_35px_rgba(0,245,212,0.35)] cursor-pointer touch-none"
          tabIndex={0}
          onPointerDown={flap}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div ref={wishesLayerRef} className="game-wishes-layer absolute inset-0 pointer-events-none" />

          {/* Start Game Overlay Prompt */}
          {gameState === 'IDLE' && !isCakeModalOpen && (
            <div className="game-start-banner absolute inset-0 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm z-30">
              <div className="game-intro-card max-w-md w-full bg-[#031d42]/90 border border-cyan-neon/50 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(0,245,212,0.4)]" onClick={(e) => e.stopPropagation()}>
                <div className="intro-butterfly-icon text-3xl mb-2">🦋 ✨ 🎂</div>
                <h3 className="intro-title font-cursive text-3xl text-cyan-neon font-bold mb-2">
                  Flappy Ocean Butterfly
                </h3>
                <p className="intro-desc text-xs text-sky-100/90 leading-relaxed mb-4">
                  Bantu kupu-kupu biru terbang anggun melewati pilar kristal bercahaya dan kumpulkan bintang & kado ulang tahun! Raih 15 poin untuk membuka kejutan kue ulang tahun 🎂✨
                </p>
                <div className="game-controls-pills flex justify-center gap-2 mb-5">
                  <span className="ctrl-pill text-[11px] px-3 py-1 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-sky-100">
                    🖱️ Klik Layar
                  </span>
                  <span className="ctrl-pill text-[11px] px-3 py-1 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-sky-100">
                    ⌨️ Spasi
                  </span>
                  <span className="ctrl-pill text-[11px] px-3 py-1 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-sky-100">
                    📱 Sentuh
                  </span>
                </div>
                <button
                  className="btn-game-play px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-neon to-sky-400 text-ocean-950 font-bold shadow-[0_0_20px_rgba(0,245,212,0.8)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  onClick={startGame}
                >
                  <span>Mulai Terbang ✨</span>
                </button>
              </div>
            </div>
          )}

          {/* Game Over Banner */}
          {gameState === 'GAMEOVER' && (
            <div className="game-start-banner absolute inset-0 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm z-30">
              <div className="game-intro-card game-over-card max-w-md w-full bg-[#031d42]/95 border border-cyan-neon/60 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(0,245,212,0.45)]" onClick={(e) => e.stopPropagation()}>
                <div className="intro-butterfly-icon text-3xl mb-2">🦋 💫</div>
                <h3 className="intro-title font-cursive text-3xl text-cyan-neon font-bold mb-3">
                  Sayap Kupu-Kupu Lelah!
                </h3>
                <div className="game-over-stats flex justify-around mb-4 bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="stat-box">
                    <span className="stat-label block text-[10px] text-sky-300 font-semibold">SKOR ANDA</span>
                    <span className="stat-val text-2xl font-bold text-white">{score}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label block text-[10px] text-amber-300 font-semibold">REKOR TERBAIK</span>
                    <span className="stat-val text-2xl font-bold text-amber-300">{bestScore}</span>
                  </div>
                </div>
                <p className="intro-desc text-xs text-sky-100 mb-5">
                  {score >= TARGET_GOAL_SCORE
                    ? 'Hebat banget! Kue kejutan sudah terbuka, kamu bisa meniup lilinnya sekarang! 🎂✨'
                    : `Tinggal ${TARGET_GOAL_SCORE - score} poin lagi menuju kue ulang tahun! Coba sekali lagi yaa 💙`}
                </p>
                <div className="game-over-actions flex justify-center gap-3">
                  <button
                    className="btn-game-play px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-neon to-sky-400 text-ocean-950 font-bold shadow-[0_0_20px_rgba(0,245,212,0.8)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    onClick={restartGame}
                  >
                    <span>Terbang Lagi 🔄</span>
                  </button>
                  {(hasUnlockedCake || score >= TARGET_GOAL_SCORE) && (
                    <button
                      className="btn-secondary-cake px-5 py-2.5 rounded-full bg-amber-400 text-ocean-950 font-bold shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      onClick={() => setIsCakeModalOpen(true)}
                    >
                      <span>Tiup Lilin Kue 🎂</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile quick tap button */}
        <div className="flappy-mobile-controls sm:hidden w-full mt-3 flex justify-center">
          <button
            className="btn-flap-mobile flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            onPointerDown={flap}
          >
            <span>🦋</span>
            <span>KEPAK SAYAP (TAP)</span>
          </button>
        </div>
      </div>

      {/* Birthday Cake Ceremony Modal */}
      {isCakeModalOpen && (
        <div className="game-cake-modal fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="cake-ceremony-card relative max-w-lg w-full bg-[#031a3d]/95 border-2 border-cyan-neon/70 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(0,245,212,0.5)]">
            <div className="ceremony-sparkle-ribbon text-xs font-bold uppercase tracking-widest text-cyan-neon mb-2">
              🎉 HAPPY BIRTHDAY! 🎉
            </div>
            <h3 className="ceremony-headline font-cursive text-3xl sm:text-4xl text-white font-bold mb-2">
              Make a Wish & Tiup Lilinnya ✨
            </h3>
            <p className="ceremony-subtext text-xs sm:text-sm text-sky-200/90 font-sans mb-6">
              Pejamkan mata sejenak, ucapkan doa terindahmu di dalam hati, lalu sentuh atau klik lilin untuk meniupnya 🎂
            </p>

            {/* 3D Birthday Cake */}
            <div className="cake-presentation-container relative mx-auto my-6 w-48 h-44 flex flex-col items-center justify-end">
              <div className="cake-pedestal" />
              <div className="cake-body">
                <div className="cake-tier tier-bottom">
                  <div className="tier-frosting" />
                  <div className="tier-cream-pearls" />
                </div>
                <div className="cake-tier tier-top">
                  <div className="tier-frosting" />
                  <div className="tier-toppings">🍓 🫐 🍓 🫐 🍓</div>
                </div>

                {/* Candle */}
                <div
                  className="celebration-candle cursor-pointer"
                  onClick={blowCandle}
                  role="button"
                  tabIndex={0}
                  title="Klik untuk meniup lilin!"
                >
                  <div className="candle-glow-aura" />
                  <div className="candle-cylinder" />
                  <div className="candle-wick" />
                  {!hasBlownCandle ? (
                    <div className="candle-flame-element">
                      <div className="flame-inner" />
                      <div className="flame-halo" />
                    </div>
                  ) : (
                    <div className="candle-smoke-puff">💨 ✨ 🤍</div>
                  )}
                </div>
              </div>
            </div>

            {!hasBlownCandle ? (
              <button
                className="btn-blow-action px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-ocean-950 font-bold shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-2 cursor-pointer"
                onClick={blowCandle}
              >
                <span className="blow-icon">🕯️</span>
                <span className="blow-text font-sans">Tiup Lilin Sekarang! ✨</span>
              </button>
            ) : (
              <div className="cake-revealed-letter mt-4 p-5 rounded-2xl bg-white/10 border border-cyan-neon/40 text-left animate-fade-in">
                <div className="revealed-letter-inner">
                  <span className="letter-butterfly-stamp text-2xl block mb-1">🦋</span>
                  <h4 className="revealed-recipient font-cursive text-2xl text-cyan-neon font-bold mb-2">
                    Selamat Ulang Tahun, {config.name}! 💙
                  </h4>
                  <p className="revealed-message text-xs sm:text-sm text-sky-100 font-sans leading-relaxed mb-4">
                    "Semoga di setiap detik pertambahan usiamu, alam semesta selalu membentangkan jalan kebahagiaan, kesehatan yang prima, rezeki yang melimpah, dan ketenangan jiwa. Jadilah pribadi yang selalu menebar kehangatan dan senyum manis seperti indahnya kepakan kupu-kupu samudra." ✨
                  </p>
                  <div className="revealed-letter-footer mb-4">
                    <span className="font-cursive text-base text-cyan-neon">With infinite love & blessings 💫</span>
                  </div>
                  <div className="ceremony-action-buttons flex gap-3">
                    <button
                      className="btn-ceremony-replay px-4 py-2 rounded-xl bg-cyan-neon/20 border border-cyan-neon/60 text-cyan-neon text-xs font-bold hover:bg-cyan-neon/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setHasBlownCandle(false);
                        setIsCakeModalOpen(false);
                        startGame();
                      }}
                    >
                      Main Lagi 🔄
                    </button>
                    <button
                      className="btn-back-retro text-xs cursor-pointer"
                      onClick={() => {
                        setIsCakeModalOpen(false);
                        onNavigate('menu');
                      }}
                    >
                      Buka Menu Kejutan 🦋
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-6" />
    </section>
  );
}
