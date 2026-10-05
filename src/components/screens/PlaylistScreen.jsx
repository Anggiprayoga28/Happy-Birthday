import React, { useState, useEffect } from 'react';
import { toggleMusic, subscribeMusicState, stopLofiBackgroundMusic } from '../../utils/audio';

export function PlaylistScreen({ config, onNavigate, onOpenLightbox }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showYoutubeEmbed, setShowYoutubeEmbed] = useState(true);
  const [progressPct, setProgressPct] = useState(35);

  useEffect(() => {
    return subscribeMusicState((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const youtubeId = config.playlist?.youtubeId || "dviEPYzH3gg";
  const songTitle = config.playlist?.songTitle || "Cinderella - Mac Miller (Lyrics) ft. Ty Dolla $ign";

  const handleStartVideo = () => {
    setShowYoutubeEmbed(true);
    stopLofiBackgroundMusic();
  };

  const handleFrameClick = (photoSrc, title) => {
    if (onOpenLightbox) {
      onOpenLightbox({
        title: title || "Golden Memory",
        caption: "Kenangan indah berbingkai keemasan ✨",
        photo: photoSrc
      });
    }
  };

  return (
    <section id="screen-playlist" className="app-screen active overflow-y-auto lg:overflow-hidden">
      <div className="screen-nav-header">
        <button
          className="btn-back-retro cursor-pointer"
          onClick={() => onNavigate('menu')}
        >
          BACK ◀
        </button>
      </div>

      <div className="playlist-stage-exact">
        {/* Mobile Header Banner (only on mobile) */}
        <div className="playlist-mobile-header mb-2 text-center lg:hidden z-10">
          <h2 className="font-cursive text-3xl text-white font-bold drop-shadow-[0_0_15px_rgba(0,245,212,0.85)]">
            Our Playlist 🎵
          </h2>
          <p className="text-[11px] text-sky-200/80 font-sans">Lagu spesial & kenangan terindah ✨</p>
        </div>
        
        {/* Left Column: Full YouTube Video Player & Gadgets */}
        <div className="ref-player-section">
          
          <div className="yt-screen-player" id="yt-player-box">
            {/* Top bar with video title & controls */}
            <div className="yt-header-bar">
              <div className="yt-left-meta">
                <span className="yt-logo-badge">🎧</span>
                <div className="yt-text-wrap">
                  <span className="yt-title-main" id="player-song-title">{songTitle}</span>
                  <span className="yt-uploader-sub">Vibe Music • Official Lyrics</span>
                </div>
              </div>
              <div className="yt-right-icons">
                <span
                  id="btn-toggle-player-sound"
                  title="Toggle Background Synth"
                  className="cursor-pointer"
                  onClick={toggleMusic}
                >
                  {isPlaying ? '🔊' : '🔈'}
                </span>
                <span>🔲</span>
                <span>⚙️</span>
              </div>
            </div>

            {/* Video Viewport with Loading Spinner / Butterfly */}
            <div className="yt-display-screen" id="video-display-area">
              {!showYoutubeEmbed ? (
                <div className="yt-spinner-wrap cursor-pointer" id="yt-center-spinner" onClick={handleStartVideo}>
                  <div className="yt-spinner-circle" />
                  <div className="yt-center-butterfly">🦋</div>
                </div>
              ) : (
                <div className="yt-iframe-container" id="yt-embed-box">
                  <iframe
                    id="yt-player-frame"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`}
                    title="YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Only show center play overlay button when NOT embedding YouTube video, so it doesn't block iframe controls */}
              {!showYoutubeEmbed && (
                <button
                  className="yt-play-trigger-btn cursor-pointer"
                  id="btn-player-play-pause"
                  title="Putar Video YouTube"
                  onClick={handleStartVideo}
                >
                  <span id="player-play-icon">▶</span>
                </button>
              )}
            </div>

            {/* Bottom Playbar & Controls */}
            <div className="yt-bottom-bar">
              <div
                className="yt-progress-container cursor-pointer"
                id="yt-progress-bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  setProgressPct(clickPct);
                }}
              >
                <div className="yt-progress-fill" id="track-progress-fill" style={{ width: `${progressPct}%` }}>
                  <div className="yt-scrubber-dot" />
                </div>
              </div>

              <div className="yt-controls-row">
                <div className="yt-left-controls">
                  <span className="yt-time-text" id="time-display">04:18</span>
                  <button
                    className="yt-small-link-btn cursor-pointer"
                    id="btn-yt-toggle"
                    onClick={() => {
                      if (!showYoutubeEmbed) {
                        stopLofiBackgroundMusic();
                      }
                      setShowYoutubeEmbed(!showYoutubeEmbed);
                    }}
                  >
                    {showYoutubeEmbed ? '🦋 Mode Visualizer' : '📺 Tampilkan Video'}
                  </button>
                </div>
                <div className="yt-right-controls">
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="yt-brand-badge cursor-pointer hover:opacity-80 transition-opacity no-underline flex items-center"
                    title="Buka langsung di YouTube"
                  >
                    <span className="yt-red-icon">▶</span>
                    <span className="yt-brand-text">YouTube ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Retro Gadget Row directly beneath Video: Boombox, TV, Neon Notes */}
          <div className="ref-gadgets-row">
            
            {/* Retro Boombox on Left */}
            <div className="gadget-box boombox-box">
              <svg viewBox="0 0 150 95" width="150" height="95">
                <path d="M45 28 L45 10 L105 10 L105 28" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
                <rect x="8" y="24" width="134" height="66" rx="5" fill="#2d3748" stroke="#1a202c" strokeWidth="2.5"/>
                <rect x="12" y="28" width="126" height="12" fill="#4a5568"/>
                <rect x="62" y="44" width="26" height="34" rx="2" fill="#1a202c" stroke="#718096" strokeWidth="1.5"/>
                <circle cx="70" cy="58" r="4.5" fill="#a0aec0"/>
                <circle cx="80" cy="58" r="4.5" fill="#a0aec0"/>
                <line x1="68" y1="70" x2="82" y2="70" stroke="#00f5d4" strokeWidth="2"/>
                <circle cx="36" cy="58" r="22" fill="#1a202c" stroke="#cbd5e1" strokeWidth="2"/>
                <circle cx="36" cy="58" r="14" fill="#4a5568"/>
                <circle cx="36" cy="58" r="7" fill="#e2e8f0"/>
                <circle cx="114" cy="58" r="22" fill="#1a202c" stroke="#cbd5e1" strokeWidth="2"/>
                <circle cx="114" cy="58" r="14" fill="#4a5568"/>
                <circle cx="114" cy="58" r="7" fill="#e2e8f0"/>
              </svg>
            </div>

            {/* Retro TV in Center */}
            <div className="gadget-box tv-box">
              <svg viewBox="0 0 135 95" width="135" height="95">
                <line x1="42" y1="6" x2="68" y2="25" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round"/>
                <line x1="92" y1="6" x2="68" y2="25" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="42" cy="6" r="3.5" fill="#00f5d4"/>
                <circle cx="92" cy="6" r="3.5" fill="#00f5d4"/>
                <rect x="12" y="24" width="112" height="66" rx="6" fill="#334155" stroke="#0f172a" strokeWidth="2.5"/>
                <rect x="20" y="30" width="76" height="52" rx="6" fill="#0f172a"/>
                <rect x="23" y="33" width="70" height="46" rx="4" fill="#f8fafc" opacity="0.95"/>
                <path d="M26 36 Q 50 34, 70 36" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.8"/>
                <circle cx="110" cy="40" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5"/>
                <circle cx="110" cy="56" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5"/>
                <line x1="104" y1="70" x2="116" y2="70" stroke="#64748b" strokeWidth="2.5"/>
                <line x1="104" y1="76" x2="116" y2="76" stroke="#64748b" strokeWidth="2.5"/>
              </svg>
            </div>

            {/* Glowing Neon Music Notes Wave on Right */}
            <div className="neon-notes-wave-box">
              <svg viewBox="0 0 220 95" width="220" height="95">
                <path d="M10 70 Q 55 15, 110 50 T 210 30" fill="none" stroke="#00f5d4" strokeWidth="3" opacity="0.95" filter="drop-shadow(0 0 8px #00f5d4)"/>
                <path d="M15 78 Q 60 23, 115 58 T 215 38" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.85" filter="drop-shadow(0 0 6px #38bdf8)"/>
                <text x="35" y="48" fill="#ffffff" fontSize="28" fontWeight="bold" filter="drop-shadow(0 0 10px #00f5d4)">♪</text>
                <text x="90" y="34" fill="#00f5d4" fontSize="34" fontWeight="bold" filter="drop-shadow(0 0 12px #00f5d4)">♫</text>
                <text x="155" y="45" fill="#67e8f9" fontSize="30" fontWeight="bold" filter="drop-shadow(0 0 10px #38bdf8)">♬</text>
              </svg>
            </div>

          </div>

        </div>

        {/* Right Column: 3 Ornate Golden Frames */}
        <div className="ref-frames-section">
          
          <div className="frames-left-stack">
            {/* Frame 1: Top Left */}
            <div
              className="gold-photo-frame frame-left-top cursor-pointer"
              title="Frame Memory 1"
              onClick={() => handleFrameClick(config.photos?.playlistFrame1 || "/assets/portrait_denim_ride.jpg", "Golden Memory 1")}
            >
              <div className="frame-outer-bezel">
                <div className="frame-inner-mat">
                  <img src={config.photos?.playlistFrame1 || "/assets/portrait_denim_ride.jpg"} alt="Golden Frame Photo 1" />
                </div>
              </div>
              <span className="gold-frame-butterfly">🦋</span>
            </div>

            {/* Frame 2: Bottom Left */}
            <div
              className="gold-photo-frame frame-left-bot cursor-pointer"
              title="Frame Memory 2"
              onClick={() => handleFrameClick(config.photos?.playlistFrame2 || "/assets/portrait_award_mirror.jpg", "Golden Memory 2")}
            >
              <div className="frame-outer-bezel">
                <div className="frame-inner-mat">
                  <img src={config.photos?.playlistFrame2 || "/assets/portrait_award_mirror.jpg"} alt="Golden Frame Photo 2" />
                </div>
              </div>
              <span className="gold-frame-butterfly">🦋</span>
            </div>
          </div>

          {/* Right Sub-column with Larger Ornate Baroque Frame */}
          <div className="frames-right-single">
            <div
              className="gold-photo-frame frame-right-baroque cursor-pointer"
              title="Frame Memory 3"
              onClick={() => handleFrameClick(config.photos?.playlistFrame3 || "/assets/portrait_award_stage.jpg", "Golden Baroque Memory")}
            >
              <div className="frame-outer-bezel ornate-carved">
                <div className="frame-inner-mat">
                  <img src={config.photos?.playlistFrame3 || "/assets/portrait_award_stage.jpg"} alt="Golden Frame Photo 3" />
                </div>
              </div>
              <span className="gold-frame-butterfly right-b">🦋</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
