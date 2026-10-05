import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export function GiftVoucherModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive celebration confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f5d4', '#38bdf8', '#0284c7', '#ffffff', '#ffd166', '#ff70a6'],
        });

        const timer = setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00f5d4', '#38bdf8', '#ffffff'],
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00f5d4', '#38bdf8', '#ffffff'],
          });
        }, 300);

        return () => clearTimeout(timer);
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      id="gift-reveal-modal"
      className="modal-backdrop active fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="gift-voucher-card relative max-w-md w-full max-h-[92vh] overflow-y-auto bg-gradient-to-br from-[#021838] via-[#052654] to-[#010e24] border-2 border-cyan-neon/70 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(0,245,212,0.5)] transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-close-modal absolute -top-3 -right-3 w-9 h-9 bg-cyan-neon text-ocean-950 font-bold rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-10 cursor-pointer"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <div className="voucher-content text-center">
          <div className="inline-block px-3.5 py-1 rounded-full bg-cyan-neon/20 border border-cyan-neon/60 text-cyan-neon text-xs font-semibold tracking-wider uppercase mb-3">
            SPECIAL BIRTHDAY TICKET 🦋✨
          </div>

          <h3 className="voucher-title font-cursive text-3xl sm:text-4xl text-white font-bold mb-3 drop-shadow-[0_0_12px_rgba(0,245,212,0.8)]">
            Kupon Cinta Tanpa Batas
          </h3>

          <p className="voucher-desc text-sm text-sky-200/90 font-sans mb-4">
            Kupon ini berlaku seumur hidup! Bisa ditukar kapan pun untuk:
          </p>

          <ul className="voucher-list text-left text-sm text-sky-100 font-sans space-y-2.5 bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5">
            <li className="flex items-center gap-2">
              <span className="text-base">🍫</span>
              <span>Cokelat / Makanan favorit kapan pun kamu mau</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🤗</span>
              <span>Pelukan hangat & didengerin curhat sampai puas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🌊</span>
              <span>Jalan-jalan berdua ke pantai atau tempat impianmu</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🦋</span>
              <span>Permintaan apa pun yang kamu mau, dikabulkan!</span>
            </li>
          </ul>

          <div className="voucher-footer mt-5 pt-3 border-t border-cyan-neon/25">
            <p className="font-cursive text-2xl text-cyan-neon">Forever Yours 💙</p>
          </div>
        </div>
      </div>
    </div>
  );
}
