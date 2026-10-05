# 🦋 Website Surprise Ulang Tahun — React & Tailwind Edition (Ocean Blue Butterfly)

Website interaktif aesthetic untuk kado ulang tahun spesial dengan tema **Biru Laut (Ocean Azure & Deep Sea)** dan **Kupu-Kupu Bioluminescent**, kini telah dimigrasikan secara penuh ke **React (Vite) + Tailwind CSS v3**.

---

## 🌟 Fitur & Arsitektur Terbaru (React + Tailwind CSS)

1. **Modern Tech Stack**:
   - **React 18**: Komponen modular, performa reaktif, state management bersih.
   - **Vite 6**: Hot Module Replacement (HMR) super cepat, build optimal.
   - **Tailwind CSS v3**: Utility-first styling dengan custom theme warna ocean, neon cyan glow, dan font romantis.
   - **canvas-confetti**: Animasi semburan konfeti pesta ulang tahun yang memukau.

2. **Komponen Modular**:
   - `src/components/screens/LandingScreen.jsx`: Amplop interaktif, kartu ucapan, foto polaroid melayang, kelopak mawar biru, dan efek partikel sentuh.
   - `src/components/screens/MenuScreen.jsx`: Menu 4 pilihan kejutan dengan kartu kupu-kupu bercahaya (*Game, Moment, Playlist, Gift*).
   - `src/components/screens/GameScreen.jsx`: Mini game *Flappy Ocean Butterfly* lengkap dengan skor, rintangan pilar kristal bercahaya, hadiah bintang/kado, serta upacara meniup lilin kue ulang tahun 3D (*Cake Candle Ceremony*).
   - `src/components/screens/MomentScreen.jsx`: Galeri 8 kolase foto polaroid asli berhias stiker paus, cincin saturnus, cap lilin cinta, dan modal Lightbox perbesaran foto.
   - `src/components/screens/PlaylistScreen.jsx`: Pemutar musik retro YouTube terintegrasi, boombox jadul, TV CRT, not balok neon menyala, dan 3 bingkai emas klasik (*Baroque Frames*).
   - `src/components/screens/GiftScreen.jsx`: Surat cinta tulisan tangan di atas perkamen vintage, bunga mawar menjalar, piringan hitam mini berputar, kamera vintage (dengan flash & suara rana foto), dan bingkai emas mawar dengan modal kupon kado ulang tahun (*Special Lifetime Ticket*).
   - `src/components/GlobalButterflies.jsx`: Mesin simulasi 5 ekor kupu-kupu Morpho 3D terbang anggun dengan jejak ekor debu bintang menyala di seluruh layar.
   - `src/components/TransitionOverlay.jsx`: Efek transisi sinematik kawanan pusaran 46 kupu-kupu 3D berspiral emas saat berpindah halaman.
   - `src/components/AudioControls.jsx`: Audio Synthesizer lofi Web Audio offline dan tombol pengatur musik di pojok kiri atas.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Mode Development (Lokal)
Jalankan dev server dengan Vite:
```bash
npm run dev
```
Buka browser di: [http://localhost:5173](http://localhost:5173)

### 2. Build untuk Production
Untuk membuat bundle siap deploy (Vercel, Netlify, GitHub Pages):
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/`.

Untuk preview hasil build secara lokal:
```bash
npm run preview
```

---

## 🎨 Cara Kustomisasi Foto & Teks

Semua data dapat disesuaikan dengan mudah di file:
👉 **[`src/config/birthdayConfig.js`](file:///Users/mac/Documents/ultah/src/config/birthdayConfig.js)**

Anda dapat mengubah:
- `name`: Nama orang tersayang (contoh: *"Justicia Chantika D A"*)
- `birthDate`: Tanggal ulang tahun
- `landingTitle`: Judul kartu di amplop
- `letterText`: Isi pesan surat cinta romantis
- `playlist.songTitle` & `playlist.youtubeId`: Lagu dan video YouTube favorit
- `photos`: Path foto-foto kenangan di folder `assets/`
- `moments`: Judul dan cerita/caption manis untuk setiap foto di galeri polaroid

---

## 🌐 Deploy Online (Gratis)
- **Vercel**: Hubungkan repository GitHub ke [Vercel](https://vercel.com), framework otomatis terdeteksi sebagai Vite.
- **Netlify**: Cukup jalankan `npm run build` lalu drag-and-drop folder `dist/` ke [Netlify Drop](https://app.netlify.com/drop).
