/**
 * Audio Synthesizer and Sound Effects Engine
 * Offline ocean lofi melody and crystalline harmonic sound effects
 */

let audioCtx = null;
let isMusicPlaying = false;
let bgmTimer = null;
let bgmNoteIndex = 0;
const listeners = new Set();

export function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Oceanic Dream Lofi Melody Notes (D Major / Pentatonic shimmer)
const lofiNotes = [
  293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 293.66,
  329.63, 392.00, 493.88, 659.25, 493.88, 392.00, 329.63,
  220.00, 293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
  196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66
];

export function playSynthNote(freq, duration = 1.2, type = "triangle", gainLevel = 0.07) {
  if (!audioCtx || !isMusicPlaying) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainLevel, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio note error:", e);
  }
}

export function playChime(freqs = [587.33, 739.99, 880.00, 1174.66]) {
  initAudioContext();
  if (!audioCtx) return;
  freqs.forEach((freq, idx) => {
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.85);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.85);
      } catch (e) {}
    }, idx * 75);
  });
}

export function playFlutterTransitionSound() {
  initAudioContext();
  if (!audioCtx) return;
  try {
    // Gentle minimalist crystal chime (2 notes, crisp & quiet)
    const quickChimes = [880.00, 1318.51];
    quickChimes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        } catch (e) {}
      }, idx * 45);
    });
  } catch (e) {}
}

export function startLofiBackgroundMusic() {
  initAudioContext();
  isMusicPlaying = true;
  notifyListeners();

  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = setInterval(() => {
    if (!isMusicPlaying) return;
    const note = lofiNotes[bgmNoteIndex % lofiNotes.length];
    playSynthNote(note, 1.4, "triangle", 0.06);

    // Soft deep bass every 4 beats
    if (bgmNoteIndex % 4 === 0) {
      playSynthNote(note / 2, 2.2, "sine", 0.09);
    }
    bgmNoteIndex++;
  }, 450);
}

export function stopLofiBackgroundMusic() {
  isMusicPlaying = false;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  notifyListeners();
}

export function toggleMusic() {
  initAudioContext();
  if (isMusicPlaying) {
    stopLofiBackgroundMusic();
  } else {
    startLofiBackgroundMusic();
  }
}

export function getIsMusicPlaying() {
  return isMusicPlaying;
}

export function subscribeMusicState(callback) {
  listeners.add(callback);
  callback(isMusicPlaying);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  listeners.forEach(cb => cb(isMusicPlaying));
}
