# RE:FRAME — Portfolio Next.js + GSAP (V6 migration)

**Basis desain:** V6 yang disetujui (bukan V7). Source ini adalah migrasi React/Next.js dari V6 Fullscreen Experience Zoom. Seluruh enam section, bahasa visual Persona-inspired, ilustrasi Hero, dan kartu tanggal `MM/YYYY` dipertahankan; animasi scroll lama diganti dengan GSAP ScrollTrigger, sedangkan Scene Index memakai Motion for React.

## Menjalankan

Persyaratan: **Node.js 20.9+** (disarankan Node.js 22+) dan koneksi internet saat menginstal dependency.

```bash
npm install
npm run dev
```

Buka **http://localhost:3000**. Untuk produksi:

```bash
npm run build
npm run start
```

**Catatan pengujian:** kode TSX dan JSX telah lolos pemeriksaan sintaks lokal menggunakan compiler TypeScript; build Next.js penuh belum dijalankan karena lingkungan pembuatan file tidak dapat mengakses registry npm untuk mengambil dependency. Jalankan `npm install && npm run build` pada mesin dengan internet sebelum deployment.

## Motion architecture

| Scene | GSAP / Motion behavior |
|---|---|
| 01 · Welcome | Menu muncul, bar **`01 — EXPERIENCE`** di-zoom **sampai memenuhi viewport**, lalu ditimpa preview Experience yang sudah memiliki teks dan card |
| 02 · Experience | Background + header tetap; kartu Professional dan Organization bergerak **vertikal** mengikuti scroll, dengan status aktif |
| 03 · Projects | Fixed backdrop. Project berikutnya **wipe-in secara horizontal di atas project sebelumnya**; tidak ada frame kosong. Reel angka `MM/YYYY` bergulir serentak |
| 04 · CV | Dokumen besar **zoom-out** dan berpindah ke posisi layout CV; teks muncul setelah perpindahan |
| 05 · Honors | Tiga penghargaan masuk dari arah, rotasi, dan timing berbeda |
| 06 · Contact | Text reveal dan stamp finishing berbeda fase |
| Scene Index | **Motion / AnimatePresence** untuk menu overlay, stagger, hover/tap |

Semua animasi scroll memakai timeline dengan `scrub`, jadi bisa **di-scroll maju atau mundur** tanpa menjalankan animasi secara acak. `useGSAP` digunakan agar timeline dan ScrollTrigger dibersihkan saat komponen unmount.

## Struktur file

```text
app/
  globals.css       Styles V6 + improvement CSS
  layout.tsx        Metadata, fonts, root
  page.tsx          Next.js entry
components/
  Scenes.tsx        Markup 6 scene (sesuai V6)
  PortfolioApp.tsx  GSAP timelines + interactions + Motion Index
public/assets/
  hero-portrait.webp  Hero art dibundel secara lokal
docs/
  MOTION_MAP.md     Kontrol urutan dan timing animasi
```

## Edit konten

- **Nama, headline, profil, role, CV, award, contact:** `components/Scenes.tsx`.
- **Detail experience**: cari `.xp-card` pada `ExperienceScene()`.
- **Project showcase**: cari `.project-slide` pada `ProjectsScene()`. Tanggal demonstrasi pada `data-date="MM/YYYY"` harus diganti dengan tanggal asli.
- **Email copy**: `copyEmail()` di `PortfolioApp.tsx`; ganti `hello@yourdomain.com`.
- **Teks Resume cetak**: `PrintResume()` di `PortfolioApp.tsx` (masih placeholder).
- **Timing animasi**: timeline di `PortfolioApp.tsx`, khususnya `zoomMenu`, `xpTl`, `gallery`, `cvTl`, `awardTl`, `outroTl`.
- **Warna/shape**: custom properties & CSS existing di `app/globals.css`.

## Prinsip yang dijaga

1. Tidak ada navbar generik; hanya Scene Index sebagai overlay.
2. Background tetap pada Experience dan Projects, hanya komponen relevan yang bergerak.
3. Slide project berikutnya masuk **di atas** slide sebelumnya, menghindari area kosong.
4. Full-screen zoom berasal dari **menu pertama**, bukan emblem/logo terpisah.
5. Semua enam scene dari V6 dipertahankan—**tidak ada pemecahan section menjadi desain V7**.
6. Menghormati pengaturan `prefers-reduced-motion` untuk mengurangi efek berat.

## Kredits desain

Gaya visual merupakan tribute/fan-inspired UI dengan elemen grafis original. Tidak memuat aset game Persona resmi. Sesuaikan placeholder sebelum publikasi.
# PersonRefWebPorto
