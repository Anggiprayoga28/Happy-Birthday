import React from 'react';

export function LightboxModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div
      id="lightbox-modal"
      className="modal-backdrop active fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="lightbox-card relative max-w-sm sm:max-w-lg w-full max-h-[92vh] overflow-y-auto bg-[#03152e]/95 border border-[#00f5d4]/40 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,245,212,0.4)] transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-close-modal absolute -top-3 -right-3 w-9 h-9 bg-cyan-neon text-ocean-950 font-bold rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-10 cursor-pointer"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <div className="lightbox-img-wrapper rounded-xl overflow-hidden bg-black/40 aspect-[4/5] flex items-center justify-center border border-white/10">
          <img
            src={data.photo}
            alt={data.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="lightbox-details mt-4 text-center">
          <h4 className="font-cursive text-2xl text-cyan-neon font-bold drop-shadow-[0_0_8px_rgba(0,245,212,0.7)]">
            {data.title}
          </h4>
          <p className="text-sm text-sky-100/90 font-sans mt-1.5 leading-relaxed">
            {data.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
