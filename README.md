# Islamic App - All in one Islamic App

![IslamicApp](/public/preview/preview-image.png)

Islamic App adalah aplikasi web modern yang dirancang untuk membantu umat Muslim dalam menjalankan ibadah harian dengan desain yang clean, responsive, dan performa yang baik.

## Fitur Utama

- **Al-Quran & Terjemahan**: Al-Quran digital lengkap dengan terjemahan bahasa Indonesia dan inggris serta pemutar audio per ayat.
- **Tafsir Ayat**: Penjelasan mendalam (tafsir) untuk memahami makna setiap ayat.
- **Jadwal Shalat & Imsakiyah**: Informasi waktu shalat dan imsakiyah yang akurat berdasarkan lokasi.
- **Kumpulan Doa Harian**: Referensi doa-doa harian untuk berbagai keperluan ibadah dan aktivitas.
- **Asmaul Husna**: Daftar 99 nama Allah yang indah beserta makna dan khasiatnya.
- **Tasbih Digital**: Fitur penghitung dzikir yang memudahkan pengguna saat beribadah.
- **Kalender Hijriyah**: Sistem penanggalan Islam untuk memantau hari-hari penting.

## Teknologi yang Digunakan

- **Next.js** - Framework React untuk performa tinggi dan SEO friendly.
- **Tailwind CSS** - Framework CSS untuk desain UI yang modern dan responsif.
- **React Query** - Library untuk manajemen state server, caching, dan sinkronisasi data API.

## Sumber Data API

- AlQuran.cloud API - Data Al-Quran global.
- Equran.id API - Data Tafsir, Jadwal Shalat, Imsakiyah, Doa Harian.
- Aladhan API - Data Kalender Hijriyah.

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/rezakurniawan88/islamic-app
cd islamic-app
```

### 2. Instalasi Dependensi

```bash
pnpm install
```

### 3. Salin file .env

```bash
cp .env.example .env
```

### 4. Jalankan Server

```bash
npm run dev
