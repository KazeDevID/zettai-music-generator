# Zettai Studio — AI Music & Song Synthesis

> Aplikasi web modern berbasis **Node.js (Express)** dan **React.js + Tailwind CSS** untuk membuat lagu dan aransemen musik lengkap dari deskripsi teks (*Text-to-Song*) atau lirik kustom (*Lyrics-to-Song*) menggunakan **Zettai Music Synthesis API (AISongMaker Engine)**.

---

## 📌 Gambaran Umum (Overview)

Aplikasi ini mengintegrasikan endpoint resmi **Zettai Music API** (`https://zettai.my.id/api/v1/genmusic/textToSong`) ke dalam antarmuka studio produksi musik yang intuitif, responsif, dan siap produksi.

Dengan aplikasi ini, Anda dapat:
- Mengetik prompt deskripsi singkat (misalnya: `seporsi mie ayam sebelum mati`) untuk menghasilkan lagu utuh dengan instrumen dan vokal profesional.
- Memasukkan lirik sendiri dengan penanda bagian lagu seperti `[Verse]`, `[Chorus]`, dan `[Bridge]`.
- Memilih model AI AISongMaker (V1 hingga V4), karakter vokal (*male*, *female*, *auto*, *random*), atau instrumen murni tanpa vokal (*instrumental*).
- Memutar master audio langsung di pemutar musik studio terintegrasi, melihat lirik lagu, dan mengunduh file MP3 hasil rekaman.

---

## ✨ Fitur Utama

- 🎵 **Text to Song Generator**: Hasilkan lagu lengkap hanya dari kalimat singkat atau ide cerita.
- 📝 **Lyrics to Song Mode**: Ciptakan aransemen musik dari teks lirik buatan Anda sendiri dengan fleksibilitas genre.
- 🎛️ **Multi-Model & Vocal Selector**:
  - Model 1: *AISongMaker V1* (Kreasi cepat)
  - Model 2: *AISongMaker V2* (Peningkatan kualitas vokal)
  - Model 3: *AISongMaker V2.1* (Eksplorasi dinamis)
  - Model 4: *AISongMaker V3* (Hasil variatif & berani)
  - Model 5: *AISongMaker V4* (Kualitas studio paling stabil & presisi - default)
- 🎧 **Master Audio Transport Bar**: Pemutar audio *sticky* dengan *waveform scrubber*, pengatur durasi, pengatur volume suara, dan tombol unduh MP3.
- 📋 **Synchronized Lyrics Sheet**: Tampilan lembar lirik lengkap dengan tombol satu-klik salin (*one-click copy*).
- ⚡ **Dual Architecture (Node.js Express + Vercel Serverless Ready)**:
  - Berjalan sebagai server full-stack di lingkungan lokal / VPS / Docker via `server.ts`.
  - Didukung konfigurasi `vercel.json` dan `api/index.ts` untuk deploy langsung di **Vercel Free Tier**.
  - Dilengkapi mekanisme *auto-fallback* langsung ke endpoint Zettai berkemampuan CORS jika terjadi *gateway timeout* pada serverless platform.
- 🎨 **Styling Terjamin & Bebas Masalah MIME Type**: Dibangun dengan Tailwind CSS v4 dan Vite dengan konfigurasi routing aset yang aman sehingga file style CSS tidak akan hilang atau terblokir saat dideploy ke Vercel.

---

## 🚀 Quick Start (Menjalankan di Komputer Lokal)

### 1. Prasyarat
- **Node.js** versi 18.x atau lebih baru (direkomendasikan Node.js 20 LTS)
- **npm**, **yarn**, atau **pnpm**

### 2. Kloning Repositori
```bash
git clone https://github.com/KazeDevID/zettai-music-generator.git
cd zettai-music-generator
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi dari `.env`:
```env
# API Key Zettai Music Generator (default menggunakan zet_free100)
ZETTAI_API_KEY="zet_free100"
```

### 5. Jalankan Aplikasi (Development)
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

### 6. Build untuk Produksi
```bash
npm run build
npm start
```

---

## ☁️ Panduan Deploy ke Vercel (100% Support Vercel Free)

Aplikasi ini sudah dilengkapi dengan file **`vercel.json`** dan serverless function **`api/index.ts`** yang dirancang khusus untuk paket **Vercel Free (Hobby)**.

### Mengapa Style CSS Terjamin Terbaca di Vercel?
Masalah umum deploy Vite di Vercel adalah file CSS (`/assets/*.css`) ikut ter-rewrite ke `index.html`, sehingga browser menolak style tersebut karena kesalahan MIME type (`text/html`).

Di proyek ini, `vercel.json` menggunakan aturan rewrite regex presisi:
```json
{
  "source": "/((?!assets/|favicon|.*\\..*).*)",
  "destination": "/index.html"
}
```
Aturan ini mengecualikan seluruh folder `/assets/` dan file berekstensi, sehingga **seluruh file CSS dan JavaScript dari Vite Tailwind CSS v4 dijamin terbaca 100% sempurna dengan header caching optimal**.

### Cara Deploy ke Vercel:

#### Opsi A: Lewat Dashboard Vercel (Direkomendasikan)
1. Push kode Anda ke repositori **GitHub**.
2. Masuk ke [vercel.com](https://vercel.com) dan klik **"Add New..."** > **"Project"**.
3. Import repositori GitHub Anda.
4. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Pada bagian **Environment Variables**, tambahkan:
   - `ZETTAI_API_KEY`: `zet_free100` (atau API Key pribadi Anda)
6. Klik tombol **Deploy**. Aplikasi akan aktif dalam hitungan detik!

#### Opsi B: Lewat Vercel CLI
```bash
npm i -g vercel
vercel
```
Ikuti instruksi di terminal dan pilih opsi *default*.

---

## 📡 Dokumentasi Endpoint Zettai API

Contoh pemanggilan endpoint bawaan yang digunakan dalam aplikasi:

```http
GET https://zettai.my.id/api/v1/genmusic/textToSong?prompt=seporsi%20mie%20ayam%20sebelum%20mati&model=5&voice=auto&instrumental=false&apikey=zet_free100
```

### Parameter Query:
| Parameter | Tipe | Wajib | Keterangan |
| :--- | :--- | :--- | :--- |
| `prompt` | `string` | Ya | Ide cerita, genre, suasana lagu (misal: `seporsi mie ayam sebelum mati`) |
| `model` | `number` | Tidak | Versi model AISongMaker (`1`, `2`, `3`, `4`, `5`). Default: `5` |
| `voice` | `string` | Tidak | Karakter vokal (`auto`, `male`, `female`, `random`). Default: `auto` |
| `instrumental` | `boolean` | Tidak | Musik murni tanpa vokal (`true` / `false`). Default: `false` |
| `apikey` | `string` | Ya | API Key Zettai (Gunakan `zet_free100` atau `APIKEYPUBLIC`) |
| `style` | `string` | Tidak | Tag genre tambahan (misal: `indie rock, acoustic ballad`) |
| `title` | `string` | Tidak | Judul lagu kustom |

### Format Respon JSON:
```json
{
  "success": true,
  "tool": "text-to-song",
  "id": "b169da5e-ac3a-49da-b543-9ce24d59babd",
  "title": "Seporsi Mie Ayam Sebelum Mati",
  "audioUrl": "https://storage.aisongmaker.io/audio/b169da5e-ac3a-49da-b543-9ce24d59babd.mp3",
  "imageUrl": "https://storage.aisongmaker.io/image/b169da5e-ac3a-49da-b543-9ce24d59babd.png",
  "duration": 160,
  "durationFormatted": "2:40",
  "lyrics": "[Verse 1]\nDi warung Bu Sari...\n[Chorus]\nSeporsi mie ayam sebelum mati...",
  "style": "Indonesian indie rock with dry sardonic humor...",
  "model": "AISongMaker V4"
}
```

---

## 📂 Struktur Direktori Proyek

```text
├── api/
│   └── index.ts            # Handler Serverless Function Vercel (Express adapter)
├── src/
│   ├── App.tsx             # Antarmuka utama studio musik & pemutar audio
│   ├── types.ts            # Type definitions, presets, & track normalizer
│   ├── index.css           # Konfigurasi Tailwind CSS v4 & custom scrollbar
│   └── main.tsx            # Entry point React 19
├── dist/                   # Hasil build statis untuk produksi
├── server.ts               # Server Node.js Express lokal & full-stack runner
├── vite.config.ts          # Konfigurasi build Vite & Tailwind CSS plugin
├── vercel.json             # Konfigurasi deploy Vercel Free & routing aset statis
├── package.json            # Daftar dependensi & script build
└── README.md               # Dokumentasi proyek
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Backend / API**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Music Synthesis API**: [Zettai API Engine](https://zettai.my.id/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**. Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan Anda.
