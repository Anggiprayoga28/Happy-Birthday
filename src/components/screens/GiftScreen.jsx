import React, { useState, useEffect } from 'react';
import { playChime, toggleMusic, subscribeMusicState } from '../../utils/audio';

export function GiftScreen({ config, onNavigate, onOpenVoucher }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return subscribeMusicState((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleCameraClick = () => {
    playChime([783.99, 987.77, 1174.66]);
    // Flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.backgroundColor = 'rgba(0, 245, 212, 0.4)';
    flash.style.zIndex = '9999';
    flash.style.transition = 'opacity 0.4s ease';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 50);
  };

  const handleUnwrap = () => {
    playChime([587.33, 739.99, 880.0, 1174.66, 1479.98]);
    if (onOpenVoucher) {
      onOpenVoucher();
    }
  };

  return (
    <section id="screen-gift" className="app-screen active w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col justify-between">
      <div className="screen-nav-header p-4 sm:p-5 z-20">
        <button
          className="btn-back-retro cursor-pointer text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2"
          onClick={() => onNavigate('menu')}
        >
          BACK ◀
        </button>
      </div>

      <div className="gift-composition-stage flex-1 flex flex-col items-center justify-center pt-14 pb-12 sm:py-6 -mt-2 sm:-mt-6">
        
        {/* Top Title: Calligraphy Name */}
        <div className="gift-name-wrapper mb-4 text-center">
          <h2
            className="gift-calligraphy-name font-cursive text-4xl sm:text-5xl md:text-6xl text-white font-bold drop-shadow-[0_0_20px_rgba(0,245,212,0.85)]"
            id="gift-person-name"
          >
            {config.name || "Justicia Chantika D A"}
          </h2>
        </div>

        {/* Main Stage containing Letter (with Roses, Vinyl, Camera) and Golden Frame */}
        <div className="gift-main-layout">
          
          {/* Section 1: White Letter with Climbing Roses */}
          <div className="gift-letter-container">
            
            {/* Climbing Red Roses Bouquet on Left */}
            <div className="gift-roses-branch-decor">
              <img src="/assets/rose_branch.png?v=10" alt="Red Roses Branch" />
            </div>

            {/* White Letter Card */}
            <div className="gift-white-paper-card">
              <img src="/assets/crumpled_paper.png?v=10" className="gift-paper-bg-img" alt="Parchment Paper" />
              <p className="gift-letter-text text-slate-800" id="gift-letter-body">
                {config.letterText || `"Selamat ulang tahun, Sayang. Di hari spesialmu ini, aku cuma mau bilang terima kasih karena sudah lahir ke dunia dan membawa begitu banyak kebahagiaan ke hidupku."`}
              </p>
            </div>

            {/* Desktop Vinyl Record Player Tucked Underneath (Hidden on mobile) */}
            <div
              className={`gift-vinyl-player-wrap hidden sm:block cursor-pointer ${isPlaying ? 'playing' : ''}`}
              id="btn-mini-vinyl-play"
              title="Play Musik"
              onClick={toggleMusic}
            >
              <img
                src="/assets/vinyl_disc.png?v=10"
                alt="Vinyl Record Player"
                className={`gift-vinyl-disc-img ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            </div>

          </div>

          {/* Desktop Vintage Camera (Hidden on mobile) */}
          <div
            className="gift-camera-wrap hidden sm:block cursor-pointer group"
            id="camera-click-sound"
            title="Click for flash! 📸"
            onClick={handleCameraClick}
          >
            <img src="/assets/camera_clean.png?v=10" alt="Vintage 35mm Camera" className="camera-img group-hover:scale-105 transition-transform" />
            <span className="camera-tooltip opacity-0 group-hover:opacity-100 transition-opacity">Click for flash! 📸</span>
          </div>

          {/* Mobile Dedicated Interactive Gadgets Bar (Visible only on mobile) */}
          <div className="gift-mobile-gadgets-bar sm:hidden flex items-center justify-around w-full max-w-[330px] px-4 py-2.5 rounded-2xl bg-[#021b3d]/70 border border-cyan-neon/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-20">
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={handleCameraClick}
              title="Flash Kamera 📸"
            >
              <img src="/assets/camera_clean.png?v=10" alt="Camera" className="w-12 h-auto drop-shadow-[0_2px_8px_rgba(0,245,212,0.4)]" />
              <span className="text-xs font-bold text-sky-100">Flash 📸</span>
            </button>
            <div className="w-[1px] h-7 bg-cyan-neon/25" />
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={toggleMusic}
              title="Play Musik 🎵"
            >
              <img
                src="/assets/vinyl_disc.png?v=10"
                alt="Vinyl"
                className={`w-10 h-10 drop-shadow-[0_2px_8px_rgba(0,245,212,0.4)] ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
              <span className="text-xs font-bold text-sky-100">{isPlaying ? 'Pause ❚❚' : 'Musik ▶'}</span>
            </button>
          </div>

          {/* Section 2: Authentic Ornate Gilded Baroque Gold Frame */}
          <div
            className="gift-frame-container cursor-pointer group"
            id="btn-unwrap-gift"
            title="Ketuk foto untuk buka hadiah kejutan! 🎁✨"
            onClick={handleUnwrap}
          >
            <div className="gift-baroque-photo-card group-hover:scale-[1.02] transition-transform">
              {/* Photo inside the frame */}
              <img
                src={config.photos?.letterFrame || "/assets/portrait_green_hijab.jpg"}
                alt="Sweet Portrait"
                className="frame-portrait-img"
                id="img-gift-portrait"
              />
              {/* Ornate baroque gold frame overlaid on top */}
              <img src="/assets/ornate_gold_frame.png?v=10" alt="Ornate Gold Frame" className="frame-gilded-overlay" />
              {/* Top Right Blooming Rose on frame corner */}
              <img src="/assets/rose_corner.png?v=10" alt="Red Rose Corner" className="frame-rose-corner-decor" />
              <div className="frame-gift-hint">
                <span className="text-xs font-bold text-white tracking-wider">Tap for Surprise 🎁✨</span>
              </div>
            </div>
          </div>

        </div>

      </div>
      <div className="h-6" />
    </section>
  );
}
