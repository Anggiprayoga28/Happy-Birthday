import React from 'react';
import { playChime } from '../../utils/audio';

export function MenuScreen({ onNavigate }) {
  const handleSelect = (target) => {
    playChime([587.33, 739.99, 880.0, 1174.66]);
    onNavigate(target);
  };

  return (
    <section id="screen-menu" className="app-screen active w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col justify-between">
      {/* Back button to return to envelope landing screen */}
      <div className="screen-nav-header p-4 sm:p-5 z-20">
        <button
          className="btn-back-retro cursor-pointer text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2"
          onClick={() => handleSelect('landing')}
          title="Kembali ke Amplop"
        >
          <span className="hidden sm:inline">BACK ◀ ENVELOPE</span>
          <span className="sm:hidden">◀ ENVELOPE</span>
        </button>
      </div>

      <div className="menu-stage flex-1 flex flex-col items-center justify-center pt-14 pb-8 sm:py-6 -mt-2 sm:-mt-8">
        <div className="menu-header mb-8 text-center">
          <h2 className="menu-title font-cursive text-4xl sm:text-5xl md:text-6xl text-white font-bold drop-shadow-[0_0_20px_rgba(0,245,212,0.8)]">
            Choose the Surprise
          </h2>
        </div>

        <div className="surprise-options-grid grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl w-full px-6">
          {/* Option 1: Game */}
          <div
            className="surprise-card group cursor-pointer"
            id="card-game"
            tabIndex={0}
            role="button"
            onClick={() => handleSelect('game')}
          >
            <div className="item-halo" />
            <div className="item-visual-box butterfly-box">
              <img
                src="/assets/butterfly_journey.png?v=12"
                alt="Birthday Game"
                className="fluttering-item asset-screened group-hover:scale-110 transition-transform duration-300"
              />
              <div className="item-glow-aura" />
            </div>
            <h3 className="item-label font-cursive text-2xl sm:text-3xl text-white group-hover:text-cyan-neon transition-colors">
              Game
            </h3>
            <div className="item-accent-bar" />
          </div>

          {/* Option 2: Moment */}
          <div
            className="surprise-card group cursor-pointer"
            id="card-moment"
            tabIndex={0}
            role="button"
            onClick={() => handleSelect('moment')}
          >
            <div className="item-halo" />
            <div className="item-visual-box butterfly-box">
              <img
                src="/assets/butterfly_moment.png?v=12"
                alt="Moment Clockwork Butterfly"
                className="fluttering-item asset-screened group-hover:scale-110 transition-transform duration-300"
              />
              <div className="item-glow-aura" />
            </div>
            <h3 className="item-label font-cursive text-2xl sm:text-3xl text-white group-hover:text-cyan-neon transition-colors">
              Moment
            </h3>
            <div className="item-accent-bar" />
          </div>

          {/* Option 3: Playlist */}
          <div
            className="surprise-card group cursor-pointer"
            id="card-playlist"
            tabIndex={0}
            role="button"
            onClick={() => handleSelect('playlist')}
          >
            <div className="item-halo" />
            <div className="item-visual-box butterfly-box">
              <img
                src="/assets/butterfly_playlist.png?v=12"
                alt="Playlist Neon Butterfly"
                className="fluttering-item asset-screened group-hover:scale-110 transition-transform duration-300"
              />
              <div className="item-glow-aura" />
            </div>
            <h3 className="item-label font-cursive text-2xl sm:text-3xl text-white group-hover:text-cyan-neon transition-colors">
              Playlist
            </h3>
            <div className="item-accent-bar" />
          </div>

          {/* Option 4: Gift */}
          <div
            className="surprise-card group cursor-pointer"
            id="card-gift"
            tabIndex={0}
            role="button"
            onClick={() => handleSelect('gift')}
          >
            <div className="item-halo" />
            <div className="item-visual-box butterfly-box">
              <img
                src="/assets/butterfly_gift.png?v=12"
                alt="Gift Ribbon Butterfly"
                className="fluttering-item floating-gift asset-screened group-hover:scale-110 transition-transform duration-300"
              />
              <div className="item-glow-aura" />
            </div>
            <h3 className="item-label font-cursive text-2xl sm:text-3xl text-white group-hover:text-cyan-neon transition-colors">
              Gift
            </h3>
            <div className="item-accent-bar" />
          </div>
        </div>
      </div>
      <div className="h-6" />
    </section>
  );
}
