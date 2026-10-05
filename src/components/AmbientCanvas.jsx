import React, { useEffect, useRef } from 'react';

export function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const pCount = 38;

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        isButterfly: Math.random() > 0.65,
        wingPhase: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.wingPhase += 0.08;

        if (p.y < -25) {
          p.y = canvas.height + 25;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.isButterfly) {
          p.x += Math.sin(p.wingPhase * 1.8) * 0.75;
          const flap = Math.abs(Math.cos(p.wingPhase * 2.6));
          const bW = 12 * Math.max(0.18, flap);
          const bH = 10;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.sin(p.wingPhase) * 0.28 - 0.08);

          // Left Wing
          ctx.fillStyle = '#00f5d4';
          ctx.beginPath();
          ctx.ellipse(-bW * 0.45, -1, bW * 0.5, bH * 0.5, -0.28, 0, Math.PI * 2);
          ctx.fill();

          // Right Wing
          ctx.beginPath();
          ctx.ellipse(bW * 0.45, -1, bW * 0.5, bH * 0.5, 0.28, 0, Math.PI * 2);
          ctx.fill();

          // Slender Body Highlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, 1.1, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="ambient-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
