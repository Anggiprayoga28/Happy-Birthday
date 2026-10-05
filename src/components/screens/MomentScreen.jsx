import React from 'react';
import { playChime } from '../../utils/audio';

export function MomentScreen({ config, onNavigate, onOpenLightbox }) {
  const handlePhotoClick = (index, photoSrc) => {
    playChime([587.33, 739.99]);
    const moment = config.moments?.[index] || {
      title: "Sweet Memory",
      caption: "Kenangan indah bersamamu ✨",
      photo: photoSrc
    };
    onOpenLightbox({
      title: moment.title,
      caption: moment.caption,
      photo: photoSrc || moment.photo
    });
  };

  return (
    <section id="screen-moment" className="app-screen active w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col justify-between">
      <div className="screen-nav-header p-4 sm:p-5 z-20">
        <button
          className="btn-back-retro cursor-pointer text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2"
          onClick={() => onNavigate('menu')}
        >
          BACK ◀
        </button>
      </div>

      <div className="journey-stage exact-reference-stage flex-1 flex flex-col items-center justify-center pt-14 pb-10 sm:py-6 -mt-2 sm:-mt-6">
        {/* Mobile Header Banner */}
        <div className="moment-mobile-header mb-3 text-center sm:hidden z-10">
          <h2 className="font-cursive text-3xl text-white font-bold drop-shadow-[0_0_15px_rgba(0,245,212,0.85)]">
            Sweet Moments ✨
          </h2>
          <p className="text-[11px] text-sky-200/80 font-sans tracking-wide">
            Ketuk foto untuk kenangan manis 💙
          </p>
        </div>

        <div className="polaroid-collage-wrapper" id="collage-wrapper-moment">
          
          <div className="ref-sticker sticker-glow-heart-left">🦋</div>
          
          <div className="ref-sticker sticker-two-hearts-top">
            <span className="sub-heart h1">✨</span>
            <span className="sub-heart h2">💙</span>
          </div>

          <div className="ref-sticker sticker-wax-seal-center">
            <div className="wax-seal-heart-inner">❤️</div>
          </div>

          <div className="ref-sticker sticker-whale-right">
            <svg viewBox="0 0 130 80" width="125" height="75">
              <path d="M12 42 C16 16, 68 12, 95 24 C108 14, 118 10, 124 12 C118 24, 112 34, 108 42 C92 64, 48 65, 22 52 C15 48, 12 44, 12 42 Z" fill="#38bdf8" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.35))"/>
              <path d="M45 42 C45 54, 75 54, 75 42 Z" fill="#ffffff" opacity="0.85"/>
              <circle cx="34" cy="30" r="3.5" fill="#0f172a"/>
              <circle cx="35" cy="29" r="1.2" fill="#ffffff"/>
              <path d="M52 42 C56 50, 64 52, 68 46 Z" fill="#0284c7"/>
              <path d="M110 26 C116 18, 124 15, 126 16 C122 24, 118 28, 114 30 Z" fill="#0284c7"/>
            </svg>
          </div>

          <div className="ref-sticker sticker-saturn-bottom-left">
            <div className="planet-body gold-planet" />
            <div className="planet-ring gold-ring" />
          </div>

          <div className="ref-sticker sticker-two-hearts-bottom">
            <span className="sub-heart b1">💎</span>
            <span className="sub-heart b2">💙</span>
          </div>

          <div className="ref-sticker sticker-saturn-bottom-right">
            <div className="planet-body purple-planet" />
            <div className="planet-ring purple-ring" />
          </div>

          <div className="ref-sticker flying-butterfly-1">🦋</div>
          <div className="ref-sticker flying-butterfly-2">🦋</div>

          <div className="exact-polaroid-gallery" id="polaroid-gallery-moment">
            <div
              className="ref-polaroid p-top-1 cursor-pointer"
              onClick={() => handlePhotoClick(8, config.photos?.polaroid9 || "/assets/portrait9.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid9 || "/assets/portrait9.jpg"} alt="Moment 9" />
              </div>
            </div>

            <div
              className="ref-polaroid p-top-2 cursor-pointer"
              onClick={() => handlePhotoClick(6, config.photos?.polaroid7 || "/assets/portrait7.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid7 || "/assets/portrait7.jpg"} alt="Moment 7" />
              </div>
            </div>

            <div
              className="ref-polaroid p-top-3 cursor-pointer"
              onClick={() => handlePhotoClick(7, config.photos?.polaroid8 || "/assets/portrait8.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid8 || "/assets/portrait8.jpg"} alt="Moment 8" />
              </div>
            </div>

            <div
              className="ref-polaroid p-top-4 cursor-pointer"
              onClick={() => handlePhotoClick(5, config.photos?.polaroid6 || "/assets/portrait6.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid6 || "/assets/portrait6.jpg"} alt="Moment 6" />
              </div>
            </div>

            <div
              className="ref-polaroid p-bot-1 cursor-pointer"
              onClick={() => handlePhotoClick(4, config.photos?.polaroid5 || "/assets/portrait5.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid5 || "/assets/portrait5.jpg"} alt="Moment 5" />
              </div>
            </div>

            <div
              className="ref-polaroid p-bot-2 cursor-pointer"
              onClick={() => handlePhotoClick(3, config.photos?.polaroid4 || "/assets/portrait4.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid4 || "/assets/portrait4.jpg"} alt="Moment 4" />
              </div>
            </div>

            <div
              className="ref-polaroid p-bot-3 cursor-pointer"
              onClick={() => handlePhotoClick(2, config.photos?.polaroid3 || "/assets/portrait3.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid3 || "/assets/portrait3.jpg"} alt="Moment 3" />
              </div>
            </div>

            <div
              className="ref-polaroid p-bot-4 cursor-pointer"
              onClick={() => handlePhotoClick(1, config.photos?.polaroid2 || "/assets/portrait_pakuwaja.jpg")}
            >
              <div className="ref-photo-inner">
                <img src={config.photos?.polaroid2 || "/assets/portrait_pakuwaja.jpg"} alt="Moment 2" />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="h-6" />
    </section>
  );
}
