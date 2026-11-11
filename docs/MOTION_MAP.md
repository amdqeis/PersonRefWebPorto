# Motion map — RE:FRAME V6 Next.js

## 01: Calling card → Experience

**Goal:** Item menu `01 — EXPERIENCE` *menjadi pintu masuk*, bukan portal lain.

GSAP `zoomMenu`: 0.07–0.22 headline menghilang; 0.20–0.40 menu masuk; 0.52–0.65 menu selain pilihan menghilang; **0.59–0.91 zoom pilihan penuh**; 0.88–0.98 Experience preview reveal.

Scale target dihitung responsif dari ukuran menu + viewport dengan overscan 1.95. Pastikan menu benar-benar memenuhi layar sebelum menampilkan scene 2.

## 02: Experience vertical timeline

GSAP `xpTl`: `#xp-track` bergerak dari posisi kartu pertama terpusat hingga kartu terakhir terpusat. Background tetap. `#xp-count` dan `#xp-mode` diperbarui per fase tanpa React re-render saat scroll.

## 03: Project showcase

GSAP `gallery`: setiap transisi dari project i ke i+1 melakukan `clipPath` reveal dari kanan ke kiri. Project i tetap terlihat **di balik** card i+1. Durasi normalized 1 per project, total 4 untuk 5 project.

Digit tanggal: enam `.date-wheel`, masing-masing berupa 100 baris `0..9`; posisi berhenti dihitung dari `data-date`, dengan rotasi ke depan dan perubahan `--flip-angle` pada engsel.

## 04: CV zoom-out

`cvTl`: paper besar/rotasi negatif menjadi ukuran final sambil slide biru + headline muncul. Berbeda dari slide 1 karena komponen mengecil, bukan membesar.

## 05: Honors asymmetrical collage

`awardTl`: Award A dari kanan atas, B dari kiri, C dari kanan bawah. Berbeda amplitudo dan back-easing.

## 06: Final calling card

`outroTl`: teks masuk lebih dahulu, stamp datang kemudian dengan rotasi.

## Engine

- GSAP: scroll-driven choreography. `ScrollTrigger` + `scrub`.
- `@gsap/react`: lifecycle-safe context.
- Motion for React (`motion/react`): Scene Index and micro-interactions.
- No Anime.js: sengaja tidak ditambahkan untuk menghindari tiga library animasi dengan overlapping ownership. Bisa ditambah untuk efek SVG khusus jika diperlukan.
