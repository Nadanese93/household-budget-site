# Dompet Mahendra — Anggaran Keluarga

[![bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Nadanese93/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Nadanese93/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Site anggaran rumah tangga berbahasa Indonesia untuk **Keluarga Mahendra** — Budi (ayah, staf logistik), Sari (ibu, guru SD & penjual kue), Raka (12 tahun), dan Nara (8 tahun) — selama November 2026. Semua angka Rupiah nyata dan konsisten: pemasukan Rp 20.500.000, pengeluaran Rp 8.820.000 dari 28 transaksi tercatat, sisa Rp 11.680.000.

## Fitur

- **Dashboard** — ringkasan bulan ini (pemasukan, pengeluaran, sisa), grafik batang belanja vs anggaran per kategori, dan grafik lingkaran porsi belanja, keduanya digambar dari data nyata dengan canvas.
- **Transaksi** — 28 transaksi nyata; tambah transaksi baru lewat form (langsung muncul dan mengubah total), filter per kategori dan kata kunci, hapus transaksi.
- **Anggaran** — batas belanja 8 kategori dengan progress bar dan sisa anggaran yang dihitung dari data nyata, plus peringatan saat kategori melewati 90% (Internet & Pulsa dan Sekolah Anak bulan ini).
- **Tagihan** — 8 tagihan rutin bulanan dengan tanggal jatuh tempo dan status lunas/belum; tagihan bisa ditandai lunas.
- **Tujuan Tabungan** — Dana Darurat, Liburan Keluarga ke Yogyakarta, dan Pendidikan Anak, dengan progress terhadap target dan form tambah setoran.

## Cara menjalankan

Site ini file statis, tanpa build step dan tanpa request jaringan:

```sh
cd app
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080/` di browser desktop atau ponsel. Navigasi memakai hash routes (`#/dashboard`, `#/transaksi`, `#/anggaran`, `#/tagihan`, `#/tujuan`).

## Struktur source

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — tampilan hijau/teal, responsif desktop + phone
- `app/data.js` — semua data keluarga: pemasukan, kategori & anggaran, transaksi, tagihan, tujuan tabungan, plus fungsi hitung total
- `app/charts.js` — grafik batang dan lingkaran (canvas murni) dari data nyata
- `app/views.js` — render tiap halaman dari state aplikasi
- `app/app.js` — router hash, state, dan semua interaksi (tambah/hapus/filter/setoran)

## Menyerahkan entry

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori output dan menulis `dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts`.
