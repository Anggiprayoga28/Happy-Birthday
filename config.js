/**
 * Configuration file for Birthday Surprise Web
 * You can easily customize names, dates, messages, and photos here!
 */
const CONFIG = {
  // Target person's name
  name: "Justicia Chantika D A",
  
  // Birthday date (shown on letter and envelope)
  birthDate: "28.08.2026",
  
  // Landing screen subtitle
  landingTitle: "Happy Birthday",
  
  // Love letter message (Screen 5)
  letterText: `"Selamat ulang tahun, Sayang. Di hari spesialmu ini, aku cuma mau bilang terima kasih karena sudah lahir ke dunia dan membawa begitu banyak kebahagiaan ke hidupku. Kamu adalah hal terindah yang pernah hadir dalam hidupku, dan aku berharap bisa terus merayakan hari-hari bahagiamu di tahun-tahun berikutnya. I love you so much, kini dan nanti."`,
  
  // Playlist settings (Screen 4)
  playlist: {
    songTitle: "Juicy Luicy - Di Balik Layar",
    artist: "Juicy Luicy",
    // You can replace with YouTube Video ID (e.g. "G_rBuh7gA7A" or custom mp3)
    youtubeId: "1X3BZYOIveM", // Romance / Lofi instrumental or favorite song
    mp3Url: "" // optional direct audio link
  },
  
  // Photos used across the website (now all unique, no duplicate images!)
  photos: {
    // Polaroid gallery on table (Screen 2)
    polaroid1: "assets/portrait1.jpg",
    polaroid2: "assets/portrait2.jpg",
    polaroid3: "assets/portrait3.jpg",
    polaroid4: "assets/portrait4.jpg",
    polaroid5: "assets/portrait5.jpg",
    polaroid6: "assets/portrait6.jpg",
    polaroid7: "assets/portrait7.jpg",
    polaroid8: "assets/portrait8.jpg",
    polaroid9: "assets/portrait9.jpg",

    // Landing Screen Unique Photos (replacing previous duplicates)
    landingHeart: "assets/portrait_green_hijab.jpg",
    landingPolaroid: "assets/portrait_waterfall.jpg",
    photostrip1: "assets/portrait_lift_office.jpg",
    photostrip2: "assets/portrait_car_night.jpg",
    photostrip3: "assets/portrait_green_hijab.jpg",

    // Love letter baroque frame (Screen 5)
    letterFrame: "assets/portrait_green_hijab.jpg",

    // Playlist screen golden frames (Screen 4, replacing previous duplicates)
    playlistFrame1: "assets/portrait_denim_ride.jpg",
    playlistFrame2: "assets/portrait_car_night.jpg",
    playlistFrame3: "assets/portrait_waterfall.jpg",
  },
  
  // Captions for Polaroid gallery
  moments: [
    { title: "Anggun & Manis", caption: "Senyummu yang selalu bikin hariku teduh dan cerah ✨", photo: "assets/portrait1.jpg" },
    { title: "Graduation Day", caption: "Bangga banget lihat kamu berhasil dan bersinar di hari kelulusanmu 🎓🦋", photo: "assets/portrait2.jpg" },
    { title: "Vintage & Cute", caption: "Pose gemas favoritku, selalu bikin kangen kapan pun 🥰📸", photo: "assets/portrait3.jpg" },
    { title: "Kebaya & Flowers", caption: "Bunga-bunga kalah cantik sama kamu yang selalu mempesona 🌸💐", photo: "assets/portrait4.jpg" },
    { title: "Nature Walk", caption: "Semua tempat jadi indah dan tenang kalau lagi jalan bareng kamu 🌲🍃", photo: "assets/portrait5.jpg" },
    { title: "Freedom & Joy", caption: "Melihatmu bahagia dan bebas di alam luas adalah pemandangan terindah 🌾☁️", photo: "assets/portrait6.jpg" },
    { title: "Senyum Gunung", caption: "Seindah-indahnya pemandangan gunung, tetap kamu yang paling memesona ⛰️💙", photo: "assets/portrait7.jpg" },
    { title: "Silly & Adorable", caption: "Tingkah usil dan lucumu yang selalu sukses bikin aku ketawa dan jatuh cinta lagi 😝✨", photo: "assets/portrait8.jpg" },
    { title: "Top of the World", caption: "Menikmati puncak dunia bersamamu, semoga langkah kita selalu seirama 🏔️🌿", photo: "assets/portrait9.jpg" }
  ]
};
