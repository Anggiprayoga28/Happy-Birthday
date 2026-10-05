import React, { useEffect, useRef } from 'react';
import { PerchedButterfly3D } from '../MorphoButterflySVG';
import { playChime } from '../../utils/audio';

export function LandingScreen({ config, onNavigate }) {
  const screenRef = useRef(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    let lastSparkle = 0;

    const handlePointerMove = (e) => {
      const now = performance.now();
      if (now - lastSparkle > 60) {
        lastSparkle = now;
        spawnSparkle(e.clientX, e.clientY);
      }
    };

    const handleClick = (e) => {
      if (e.target.closest('#btn-tap-surprise') || e.target.closest('.audio-control-container')) return;
      spawnButterflyBurst(e.clientX, e.clientY);
    };

    screen.addEventListener('pointermove', handlePointerMove);
    screen.addEventListener('click', handleClick);

    return () => {
      screen.removeEventListener('pointermove', handlePointerMove);
      screen.removeEventListener('click', handleClick);
    };
  }, []);

  function spawnSparkle(x, y) {
    const spark = document.createElement('div');
    spark.className = 'interactive-sparkle';
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
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 650);
  }

  function spawnButterflyBurst(x, y) {
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const miniB = document.createElement('div');
      miniB.className = 'perched-bf3d';
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
        transform: translate(0, 0) scale(0.4) rotate(${(angle * 180) / Math.PI}deg);
      `;
      document.body.appendChild(miniB);

      requestAnimationFrame(() => {
        miniB.style.transform = `translate(${targetX - x}px, ${targetY - y}px) scale(1.15) rotate(${(angle * 180) / Math.PI}deg)`;
        miniB.style.opacity = '0';
      });
      setTimeout(() => miniB.remove(), 800);
    }
  }

  const handleTapSurprise = () => {
    playChime([523.25, 659.25, 783.99, 1046.5]);
    onNavigate('menu');
  };

  return (
    <section ref={screenRef} id="screen-landing" className="app-screen active w-full h-full relative overflow-hidden flex items-center justify-center">
      <div className="landing-stage relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Envelope & Letter Composition */}
        <div className="envelope-composition">
          
          {/* Back Envelope Flap */}
          <div className="envelope-back" />

          {/* Birthday Card emerging from Envelope */}
          <div className="birthday-card-letter">
            <div className="card-inner">
              <h1 className="card-title font-cursive">{config.landingTitle || "Happy Birthday"}</h1>
              <p className="card-date font-cursive">{config.birthDate || "28.08.26"}</p>
            </div>
            <div className="card-butterfly-watermark">🦋</div>
          </div>

          {/* Envelope Front Pocket */}
          <div className="envelope-pocket">
            <div className="envelope-seal">
              <div className="seal-butterfly-icon">
                <PerchedButterfly3D />
              </div>
            </div>
          </div>

          {/* Heart Frame Photo with Butterfly Wings (Left) */}
          <div className="decor-heart-photo float-slow" id="landing-heart-container">
            <div className="heart-mask">
              <img src={config.photos?.landingHeart || "/assets/portrait_green_hijab.jpg"} alt="Heart Memory" />
            </div>
            <div className="heart-butterfly-accent">
              <PerchedButterfly3D />
            </div>
          </div>

          {/* Polaroid Photo (Bottom Left) */}
          <div className="decor-polaroid tilt-left float-medium">
            <div className="polaroid-frame">
              <img src={config.photos?.landingPolaroid || "/assets/portrait_waterfall.jpg"} alt="Polaroid Memory" />
              <div className="polaroid-mini-butterfly">
                <PerchedButterfly3D />
              </div>
            </div>
          </div>

          {/* Photostrip (Right) */}
          <div className="decor-photostrip tilt-right float-slow">
            <div className="photostrip-inner">
              <div className="strip-item"><img src={config.photos?.photostrip1 || "/assets/portrait_lift_office.jpg"} alt="Strip 1" /></div>
              <div className="strip-item"><img src={config.photos?.photostrip2 || "/assets/portrait_car_night.jpg"} alt="Strip 2" /></div>
              <div className="strip-item"><img src={config.photos?.photostrip3 || "/assets/portrait_green_hijab.jpg"} alt="Strip 3" /></div>
            </div>
            <div className="photostrip-butterfly-top">
              <PerchedButterfly3D />
            </div>
          </div>

          {/* Glowing Blue Rose Decor Top Right */}
          <div className="decor-rose-bloom bloom-top-right float-fast">
            <img src="/assets/blue_roses.png?v=12" alt="Ocean Blue Rose Decor" className="rose-img-blend asset-screened" />
          </div>

          {/* Crystal Sparkles Cluster */}
          <div className="sakura-cluster">
            <span className="blossom mini">✨</span>
            <span className="blossom">💎</span>
            <span className="blossom mini">✨</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="landing-action-area z-20">
          <button
            id="btn-tap-surprise"
            onClick={handleTapSurprise}
            className="tap-surprise-btn group cursor-pointer"
            aria-label="Tap for surprise"
          >
            <span className="tap-text tracking-widest text-sm font-bold text-white group-hover:text-cyan-neon transition-colors">
              TAP FOR SURPRISE
            </span>
            <span className="tap-underline" />
          </button>
        </div>

      </div>
    </section>
  );
}
