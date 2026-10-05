import React, { useImperativeHandle, forwardRef, useState, useMemo } from 'react';
import { playFlutterTransitionSound } from '../utils/audio';

export const TransitionOverlay = forwardRef(function TransitionOverlay(props, ref) {
  const [isActive, setIsActive] = useState(false);

  // Pre-calculate 16 lightweight butterflies along a golden spiral (calculated only once)
  const butterflyCluster = useMemo(() => {
    const count = 16;
    const goldenAngle = 2.39996;
    const items = [];

    for (let i = 0; i < count; i++) {
      const theta = i * goldenAngle;
      const norm = i / count;
      const radius = 24 + Math.pow(norm, 0.72) * 140;
      const x = Math.round(Math.cos(theta) * radius);
      const y = Math.round(Math.sin(theta) * radius);

      const sizeW = Math.round(28 + Math.pow(norm, 0.6) * 16);
      const sizeH = Math.round(sizeW * 0.82);
      const facingDeg = Math.round((theta + Math.PI / 2 + 0.25) * (180 / Math.PI));

      items.push({
        id: i,
        x,
        y,
        w: sizeW,
        h: sizeH,
        facingDeg,
      });
    }
    return items;
  }, []);

  useImperativeHandle(ref, () => ({
    triggerTransition(callback) {
      playFlutterTransitionSound();

      // Start compositor-driven keyframe animation
      setIsActive(true);

      // Instant screen swap at peak zoom (280ms)
      setTimeout(() => {
        if (callback) callback();
      }, 280);

      // Cleanup when keyframe finishes (620ms)
      setTimeout(() => {
        setIsActive(false);
      }, 620);
    },
  }));

  return (
    <div
      id="butterfly-transition-overlay"
      className={`transition-overlay ${isActive ? 'is-active' : ''}`}
      aria-hidden="true"
    >
      <div className="swirl-transition-backdrop" />

      {/* Swirling Butterfly Cluster Stage */}
      <div className="butterfly-cluster-stage">
        <div className="cluster-glow-core" />
        <div className="cluster-rotator">
          {butterflyCluster.map((b) => (
            <div
              key={b.id}
              className="cluster-bf3d"
              style={{
                width: `${b.w}px`,
                height: `${b.h}px`,
                marginLeft: `${-b.w / 2}px`,
                marginTop: `${-b.h / 2}px`,
                transform: `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.facingDeg}deg)`,
              }}
            >
              <div className="cluster-bf3d-assembly">
                <div className="wing-left">
                  <svg viewBox="0 0 80 102" className="wing-svg">
                    <use href="#svg-morpho-wing" />
                  </svg>
                </div>
                <div className="bf3d-body" />
                <div className="wing-right">
                  <svg viewBox="0 0 80 102" className="wing-svg">
                    <use href="#svg-morpho-wing" />
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {/* Stardust dots */}
          {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
            <div
              key={`dot-${idx}`}
              className="cluster-sparkle-dot"
              style={{
                width: `${Math.round(2 + (idx % 2) * 1.5)}px`,
                height: `${Math.round(2 + (idx % 2) * 1.5)}px`,
                left: `calc(50% + ${Math.round(Math.cos((deg * Math.PI) / 180) * (50 + idx * 8))}px)`,
                top: `calc(50% + ${Math.round(Math.sin((deg * Math.PI) / 180) * (50 + idx * 8))}px)`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
