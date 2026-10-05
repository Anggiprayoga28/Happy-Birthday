import React, { useEffect, useRef } from 'react';

export function GlobalButterflies() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const trailCanvas = canvasRef.current;
    if (!container || !trailCanvas) return;

    const tCtx = trailCanvas.getContext('2d');
    let animId;

    const resizeTrailCanvas = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    // 5 Unique Morpho Butterflies with varying sizes, speeds & flight styles
    const butterflyConfigs = [
      { id: 1, w: 62, h: 52, baseSpeed: 2.2, turnRate: 0.04, flapFreq: 0.16, scale: 1.05 },
      { id: 2, w: 52, h: 44, baseSpeed: 2.6, turnRate: 0.048, flapFreq: 0.18, scale: 0.95 },
      { id: 3, w: 42, h: 36, baseSpeed: 3.0, turnRate: 0.052, flapFreq: 0.22, scale: 0.85 },
      { id: 4, w: 56, h: 48, baseSpeed: 2.0, turnRate: 0.038, flapFreq: 0.15, scale: 1.0 },
      { id: 5, w: 38, h: 32, baseSpeed: 2.8, turnRate: 0.05, flapFreq: 0.2, scale: 0.8 },
    ];

    container.innerHTML = '';
    const butterflies = [];

    butterflyConfigs.forEach((cfg, idx) => {
      const el = document.createElement('div');
      el.className = 'global-bf3d';
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

      // Spawn along the outer margins (top, right, bottom, left) away from center
      const edge = idx % 4;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      let posX, posY, startAngle;

      if (edge === 0) {
        // Top perimeter
        posX = 50 + Math.random() * (screenW - 100);
        posY = 25 + Math.random() * Math.min(screenH * 0.16, 90);
        startAngle = Math.random() < 0.5 ? 0 : Math.PI;
      } else if (edge === 1) {
        // Right perimeter
        posX = screenW - (35 + Math.random() * Math.min(screenW * 0.15, 80));
        posY = 50 + Math.random() * (screenH - 100);
        startAngle = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2;
      } else if (edge === 2) {
        // Bottom perimeter
        posX = 50 + Math.random() * (screenW - 100);
        posY = screenH - (35 + Math.random() * Math.min(screenH * 0.16, 80));
        startAngle = Math.random() < 0.5 ? 0 : Math.PI;
      } else {
        // Left perimeter
        posX = 35 + Math.random() * Math.min(screenW * 0.15, 80);
        posY = 50 + Math.random() * (screenH - 100);
        startAngle = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2;
      }

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
        orbitDir: idx % 2 === 0 ? 1 : -1,
        tailPoints: [],
      });
    });

    const trailParticles = [];
    const MAX_PARTICLES = 160;

    let mouseX = -9999;
    let mouseY = -9999;
    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove);

    function renderGlobalButterflies() {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // 1. Clear Trail Canvas
      tCtx.clearRect(0, 0, screenW, screenH);

      // Central exclusion zone - prevents butterflies from blocking UI content
      const centerX = screenW / 2;
      const centerY = screenH / 2;
      // Boundaries of central interactive content (cards, text, buttons, photos)
      const safeHalfW = Math.max(130, Math.min(screenW * 0.38, 480));
      const safeHalfH = Math.max(140, Math.min(screenH * 0.36, 330));

      // 2. Update and Draw Butterflies
      butterflies.forEach((b) => {
        b.noiseSeed += 0.009;

        // Smooth Natural Steering (sinusoidal waves)
        const naturalTurn = Math.sin(b.noiseSeed) * 0.8 + Math.cos(b.noiseSeed * 0.6) * 0.4;

        // Force 1: Center Content Exclusion (Radial + Tangential deflection)
        const dx = b.x - centerX;
        const dy = b.y - centerY;
        const normX = dx / safeHalfW;
        const normY = dy / safeHalfH;
        const centerDistNorm = Math.hypot(normX, normY);

        let centerForceX = 0;
        let centerForceY = 0;

        if (centerDistNorm < 1.35) {
          const urgency = Math.pow(Math.max(0, 1.35 - centerDistNorm) / 1.35, 1.3);
          const angleOut = Math.atan2(dy, dx);
          // Glides along the outer boundary instead of crashing into it
          const orbitAngle = angleOut + b.orbitDir * (Math.PI * 0.46);

          centerForceX = (Math.cos(angleOut) * 2.4 + Math.cos(orbitAngle) * 1.8) * urgency;
          centerForceY = (Math.sin(angleOut) * 2.4 + Math.sin(orbitAngle) * 1.8) * urgency;
        }

        // Force 2: Soft screen border avoidance (keeps butterfly within screen perimeter)
        const borderMargin = Math.min(screenW * 0.08, 65);
        let borderForceX = 0;
        let borderForceY = 0;

        if (b.x < borderMargin) borderForceX = (borderMargin - b.x) / borderMargin;
        if (b.x > screenW - borderMargin) borderForceX = -(b.x - (screenW - borderMargin)) / borderMargin;
        if (b.y < borderMargin) borderForceY = (borderMargin - b.y) / borderMargin;
        if (b.y > screenH - borderMargin) borderForceY = -(b.y - (screenH - borderMargin)) / borderMargin;

        // Force 3: Gentle cursor avoidance
        const distToMouse = Math.hypot(b.x - mouseX, b.y - mouseY);
        let avoidForceX = 0;
        let avoidForceY = 0;
        if (distToMouse < 130) {
          const push = (130 - distToMouse) / 130;
          avoidForceX = ((b.x - mouseX) / distToMouse) * push * 1.4;
          avoidForceY = ((b.y - mouseY) / distToMouse) * push * 1.4;
        }

        // Combine steering forces
        let steerX = Math.cos(b.angle + naturalTurn * 0.08);
        let steerY = Math.sin(b.angle + naturalTurn * 0.08);

        if (Math.hypot(centerForceX, centerForceY) > 0.04) {
          steerX += centerForceX * 3.2;
          steerY += centerForceY * 3.2;
        }

        if (Math.hypot(borderForceX, borderForceY) > 0.05) {
          steerX += borderForceX * 2.4;
          steerY += borderForceY * 2.4;
        }

        if (Math.hypot(avoidForceX, avoidForceY) > 0.1) {
          steerX += avoidForceX * 1.6;
          steerY += avoidForceY * 1.6;
        }

        b.targetAngle = Math.atan2(steerY, steerX);

        // Shortest angular difference interpolation (slerp)
        let diff = b.targetAngle - b.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        b.angle += diff * b.turnRate;

        // Dynamic speed
        b.speed = b.baseSpeed * (1 + Math.abs(diff) * 0.35);

        // Position update
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        // Hard exclusion zone protection: strictly prevent entering inner core content area
        if (centerDistNorm < 0.98) {
          const angleOut = Math.atan2(dy, dx);
          const pushOutDistX = centerX + Math.cos(angleOut) * (safeHalfW * 1.02);
          const pushOutDistY = centerY + Math.sin(angleOut) * (safeHalfH * 1.02);
          b.x += (pushOutDistX - b.x) * 0.12;
          b.y += (pushOutDistY - b.y) * 0.12;
          b.angle = angleOut + b.orbitDir * 0.4;
        }

        // Hard clamp inside screen borders
        b.x = Math.max(18, Math.min(screenW - 18, b.x));
        b.y = Math.max(18, Math.min(screenH - 18, b.y));

        // Wing flapping & flight undulation
        b.wingPhase += b.flapFreq;
        const undulation = Math.sin(b.wingPhase) * 1.6;

        // 3D Banking Roll
        const targetBank = Math.max(-35, Math.min(35, diff * 42));
        b.bank += (targetBank - b.bank) * 0.12;

        // Transform DOM element in 3D
        const visualDeg = (b.angle * 180) / Math.PI + 90;
        b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2 + undulation}px, 0) rotate(${visualDeg}deg) rotateZ(${b.bank}deg) scale(${b.scale})`;

        // Emit Tail Stardust Particles
        const tailDist = b.w * 0.38;
        const tailX = b.x - Math.cos(b.angle) * tailDist;
        const tailY = b.y - Math.sin(b.angle) * tailDist;

        // Keep recent tail points for smooth light ribbon
        b.tailPoints.push({ x: tailX, y: tailY });
        if (b.tailPoints.length > 9) b.tailPoints.shift();

        // Emit particles
        if (trailParticles.length < MAX_PARTICLES) {
          const colors = ['#00f5d4', '#38bdf8', '#ffffff', '#7dd3fc', '#a7f3d0'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          const isStar = Math.random() > 0.82;

          trailParticles.push({
            x: tailX + (Math.random() - 0.5) * 6,
            y: tailY + (Math.random() - 0.5) * 6,
            vx: -Math.cos(b.angle) * 0.4 + (Math.random() - 0.5) * 0.6,
            vy: -Math.sin(b.angle) * 0.4 + (Math.random() - 0.5) * 0.6 + 0.15,
            size: isStar ? Math.random() * 3 + 2.5 : Math.random() * 2.2 + 1.2,
            alpha: 0.95,
            decay: Math.random() * 0.02 + 0.015,
            color: col,
            isStar: isStar,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
          });
        }
      });

      // 3. Draw Fading Streamer Ribbons
      butterflies.forEach((b) => {
        if (b.tailPoints.length < 3) return;
        tCtx.save();
        tCtx.beginPath();
        tCtx.moveTo(b.tailPoints[0].x, b.tailPoints[0].y);
        for (let i = 1; i < b.tailPoints.length; i++) {
          tCtx.lineTo(b.tailPoints[i].x, b.tailPoints[i].y);
        }
        tCtx.strokeStyle = 'rgba(0, 245, 212, 0.45)';
        tCtx.lineWidth = 1.8;
        tCtx.lineCap = 'round';
        tCtx.lineJoin = 'round';
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

        if (p.isStar) {
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
          tCtx.beginPath();
          tCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          tCtx.fill();
        }

        tCtx.restore();
      }

      animId = requestAnimationFrame(renderGlobalButterflies);
    }

    renderGlobalButterflies();

    return () => {
      window.removeEventListener('resize', resizeTrailCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="butterfly-trail-canvas"
        className="butterfly-trail-canvas fixed inset-0 w-full h-full pointer-events-none z-[3]"
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        id="global-flying-butterflies"
        className="global-butterflies-layer fixed inset-0 pointer-events-none z-[4]"
        aria-hidden="true"
      />
    </>
  );
}
