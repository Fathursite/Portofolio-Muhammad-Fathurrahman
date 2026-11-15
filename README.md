# Portofolio — Muhammad Fathurrahman, S.Kom

Situs portofolio statis (HTML + CSS + JS, tanpa build tool) yang siap di-hosting di **GitHub Pages**.

## Struktur
```
index.html
assets/
  css/style.css
  js/main.js
  img/foto-profil.jpg      <- foto di situs (latar sudah diganti)
  img/foto-asli.jpg        <- foto asli berlatar merah (cadangan)
  img/og-cover.png         <- gambar pratinjau saat tautan dibagikan
sertifikat/
  pdf/                     <- file PDF (diunduh saat kartu diklik)
  thumb/                   <- gambar kecil di kartu
  preview/                 <- gambar besar untuk jendela pratinjau
404.html  robots.txt
.nojekyll
```

## Langkah hosting di GitHub Pages
1. Buat repository baru di GitHub. Nama `USERNAME.github.io` akan tampil di `https://USERNAME.github.io`; nama lain tampil di `https://USERNAME.github.io/NAMA-REPO/`.
2. Upload **isi** folder ini (bukan folder pembungkusnya) ke repository, atau lewat terminal:
   ```bash
   git init
   git add .
   git commit -m "Portofolio pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
3. Di GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `main` / `(root)` -> Save**.
4. Tunggu 1-2 menit, lalu buka alamat situs yang tampil di halaman Pages.

## Mengubah isi
- Username GitHub, email, dan teks peran yang diketik: bagian atas `assets/js/main.js`.
- Tautan GitHub di HTML juga memakai atribut `data-gh`, jadi cukup ubah `GITHUB_URL` di `main.js`.
- Menambah sertifikat: taruh PDF di `sertifikat/pdf/`, gambar pratinjau di `sertifikat/thumb/`, lalu salin satu blok `<li class="cc ...">` di `index.html` dan sesuaikan.
- Warna dan font: variabel di bagian atas `assets/css/style.css`.

- Menambah sertifikat juga butuh gambar besar di `sertifikat/preview/NAMA.jpg` dan atribut `data-slug`, `data-name`, `data-date`, `data-tag`, `data-q`, `data-dl` pada `<li>`.
- Cetak / simpan PDF: tombol di bagian Kontak memakai gaya cetak khusus.
