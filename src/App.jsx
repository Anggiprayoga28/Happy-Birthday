import React, { useState, useRef } from 'react';
import { CONFIG } from './config/birthdayConfig';
import { MorphoButterflyDefs } from './components/MorphoButterflySVG';
import { AmbientCanvas } from './components/AmbientCanvas';
import { GlobalButterflies } from './components/GlobalButterflies';
import { TransitionOverlay } from './components/TransitionOverlay';
import { AudioControls } from './components/AudioControls';
import { LightboxModal } from './components/LightboxModal';
import { GiftVoucherModal } from './components/GiftVoucherModal';

import { LandingScreen } from './components/screens/LandingScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { GameScreen } from './components/screens/GameScreen';
import { MomentScreen } from './components/screens/MomentScreen';
import { PlaylistScreen } from './components/screens/PlaylistScreen';
import { GiftScreen } from './components/screens/GiftScreen';

export function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [lightboxData, setLightboxData] = useState(null);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const transitionRef = useRef(null);

  const handleNavigate = (targetScreen) => {
    if (targetScreen === currentScreen) return;

    if (transitionRef.current) {
      transitionRef.current.triggerTransition(() => {
        setCurrentScreen(targetScreen);
      });
    } else {
      setCurrentScreen(targetScreen);
    }
  };

  const openLightbox = (data) => {
    setLightboxData(data);
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  const openVoucher = () => {
    setIsVoucherOpen(true);
  };

  const closeVoucher = () => {
    setIsVoucherOpen(false);
  };

  return (
    <div className="theme-ocean-butterfly relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden select-none bg-[radial-gradient(ellipse_at_60%_48%,#0096c7_0%,#0077b6_28%,#023e8a_58%,#03045e_82%,#010a17_100%)] text-white font-sans">
      {/* 3D Morpho Butterfly SVG Gradient & Filter Definitions */}
      <MorphoButterflyDefs />

      {/* Background Ambient Canvas: Glowing Stardust Particles */}
      <AmbientCanvas />

      {/* Global 3D Flying Butterflies & Shimmering Stardust Trail */}
      <GlobalButterflies />

      {/* Floating Audio Controls (Top Left) */}
      <AudioControls />

      {/* Swirling Butterfly Cluster Zoom In & Out Overlay */}
      <TransitionOverlay ref={transitionRef} />

      {/* Main Screens Container */}
      <main className="relative z-10 w-full h-full flex flex-col">
        {currentScreen === 'landing' && (
          <LandingScreen config={CONFIG} onNavigate={handleNavigate} />
        )}
        {currentScreen === 'menu' && (
          <MenuScreen config={CONFIG} onNavigate={handleNavigate} />
        )}
        {currentScreen === 'game' && (
          <GameScreen config={CONFIG} onNavigate={handleNavigate} />
        )}
        {currentScreen === 'moment' && (
          <MomentScreen config={CONFIG} onNavigate={handleNavigate} onOpenLightbox={openLightbox} />
        )}
        {currentScreen === 'playlist' && (
          <PlaylistScreen config={CONFIG} onNavigate={handleNavigate} onOpenLightbox={openLightbox} />
        )}
        {currentScreen === 'gift' && (
          <GiftScreen config={CONFIG} onNavigate={handleNavigate} onOpenVoucher={openVoucher} />
        )}
      </main>

      {/* Modals */}
      <LightboxModal
        isOpen={Boolean(lightboxData)}
        onClose={closeLightbox}
        data={lightboxData}
      />

      <GiftVoucherModal
        isOpen={isVoucherOpen}
        onClose={closeVoucher}
      />
    </div>
  );
}

export default App;
