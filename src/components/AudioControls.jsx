import React, { useState, useEffect } from 'react';
import { toggleMusic, subscribeMusicState } from '../utils/audio';

export function AudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return subscribeMusicState((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  return (
    <div className="audio-control-container fixed top-3 sm:top-5 left-3 sm:left-5 z-[90]">
      <button
        id="btn-toggle-bgm"
        onClick={toggleMusic}
        className="glass-pill-btn flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md bg-[#001738]/70 hover:bg-[#00285a]/85 border border-[#00f5d4]/40 hover:border-[#00f5d4] text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(0,245,212,0.35)] hover:shadow-[0_0_22px_rgba(0,245,212,0.6)] transition-all duration-300 group cursor-pointer"
        title="Toggle Musik"
        type="button"
      >
        <span className={`music-icon text-sm sm:text-base inline-block transform transition-transform duration-500 ${isPlaying ? 'rotating animate-spin-slow' : 'opacity-80 group-hover:scale-110'}`}>
          🦋
        </span>
        <span className="music-text font-sans">
          {isPlaying ? 'Music On' : 'Music Off'}
        </span>
      </button>
    </div>
  );
}
