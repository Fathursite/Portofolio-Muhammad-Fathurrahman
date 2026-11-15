# Portofolio — Muhammad Fathurrahman, S.Kom

Situs portofolio statis (HTML + CSS + JS, tanpa build tool) yang siap di-hosting di **GitHub Pages**.

## Struktur
```
index.html
assets/
  css/style.css
  js/main.js
  img/foto-profil.jpg      <- GANTI dengan foto Anda (rasio 3:4, mis. 600x800)
sertifikat/
  pdf/                     <- file PDF (diunduh saat kartu diklik)
  thumb/                   <- gambar pratinjau kartu
.nojekyll
```

## Langkah hosting di GitHub Pages
1. Ganti `assets/img/foto-profil.jpg` dengan foto Anda.
2. Buat repository baru di GitHub. Nama `USERNAME.github.io` akan tampil di `https://USERNAME.github.io`; nama lain tampil di `https://USERNAME.github.io/NAMA-REPO/`.
3. Upload **isi** folder ini (bukan folder pembungkusnya) ke repository, atau lewat terminal:
   ```bash
   git init
   git add .
   git commit -m "Portofolio pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
4. Di GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `main` / `(root)` -> Save**.
5. Tunggu 1-2 menit, lalu buka alamat situs yang tampil di halaman Pages.

## Mengubah isi
- Username GitHub, email, dan teks peran yang diketik: bagian atas `assets/js/main.js`.
- Tautan GitHub di HTML juga memakai atribut `data-gh`, jadi cukup ubah `GITHUB_URL` di `main.js`.
- Menambah sertifikat: taruh PDF di `sertifikat/pdf/`, gambar pratinjau di `sertifikat/thumb/`, lalu salin satu blok `<li class="cc ...">` di `index.html` dan sesuaikan.
- Warna dan font: variabel di bagian atas `assets/css/style.css`.
