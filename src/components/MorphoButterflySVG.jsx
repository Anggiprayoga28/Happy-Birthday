import React from 'react';

export function MorphoButterflyDefs() {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="morphoGradFore" x1="100%" y1="50%" x2="0%" y2="20%">
          <stop offset="0%" stopColor="#023e8a" />
          <stop offset="28%" stopColor="#0077b6" />
          <stop offset="62%" stopColor="#00b4d8" />
          <stop offset="88%" stopColor="#00f5d4" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="morphoGradHind" x1="100%" y1="30%" x2="10%" y2="90%">
          <stop offset="0%" stopColor="#012a4a" />
          <stop offset="40%" stopColor="#0077b6" />
          <stop offset="82%" stopColor="#00f5d4" />
        </linearGradient>
        <filter id="morphoNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <g id="svg-morpho-wing">
          {/* Forewing */}
          <path
            d="M78 52 C75 30 60 6 36 2 C16 -2 2 12 4 32 C6 50 28 66 58 72 C70 74 76 64 78 52 Z"
            fill="url(#morphoGradFore)"
            filter="url(#morphoNeonGlow)"
          />
          {/* Hindwing */}
          <path
            d="M76 54 C68 60 42 66 32 78 C20 92 34 100 52 98 C68 96 75 78 76 54 Z"
            fill="url(#morphoGradHind)"
            filter="url(#morphoNeonGlow)"
          />
          {/* Glowing Veins */}
          <path
            d="M78 52 C60 40 42 22 36 12 M78 52 C55 36 28 32 10 32 M78 52 C50 48 30 56 16 62 M76 54 C58 68 44 82 38 90 M76 54 C66 74 58 88 52 95"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
          {/* Luminescent stardust rim dots */}
          <circle cx="28" cy="6" r="1.3" fill="#ffffff" />
          <circle cx="12" cy="18" r="1.2" fill="#ffffff" />
          <circle cx="6" cy="34" r="1.2" fill="#ffffff" />
          <circle cx="16" cy="54" r="1.1" fill="#ffffff" />
          <circle cx="32" cy="88" r="1.2" fill="#ffffff" />
          <circle cx="48" cy="97" r="1.1" fill="#ffffff" />
        </g>
      </defs>
    </svg>
  );
}

export function PerchedButterfly3D({ className = '', style = {} }) {
  return (
    <div className={`perched-bf3d ${className}`} style={style}>
      <div className="bf3d-wing wing-left">
        <svg viewBox="0 0 80 102" className="wing-svg">
          <use href="#svg-morpho-wing" />
        </svg>
      </div>
      <div className="bf3d-body">
        <div className="bf3d-antennae"></div>
      </div>
      <div className="bf3d-wing wing-right">
        <svg viewBox="0 0 80 102" className="wing-svg">
          <use href="#svg-morpho-wing" />
        </svg>
      </div>
    </div>
  );
}
