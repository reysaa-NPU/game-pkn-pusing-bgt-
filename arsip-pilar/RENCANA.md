# RENCANA GAME — "Pancasila dalam Kehidupan"

Dokumen ini mencatat kesepakatan awal dan keputusan akhir. Status:
**implementasi awal selesai** — game sudah bisa dimainkan di browser.

## 1. Ringkasan

Game kuis edukatif tentang Pancasila untuk siswa SMA/SMK, berbasis web
(HTML + CSS + JavaScript), dimainkan di browser tanpa perlu instalasi.
Pemain menjawab 25 soal isian singkat dengan batas waktu 45 detik per soal.

- **Judul:** Pancasila dalam Kehidupan
- **Nama game:** PILAR
- **Target:** siswa SMA/SMK
- **Mood visual:** modern / kekinian (neo-brutalist ringan, warna pop)
- **Deadline:** 5 hari

## 2. Spesifikasi final

| Item | Nilai |
|---|---|
| Total soal | 25 (5 soal per sila) |
| Format soal | 100% isian singkat |
| Waktu | 45 detik per soal |
| Mode | Belajar & Ujian |
| Pembahasan | Tidak ada, hanya kunci jawaban |
| Skor benar | 100 poin per soal |
| Skor maksimal | 2.500 |
| Nilai akhir | (jumlah benar / 25) x 100 |
| Batas lulus | 70 |
| Bonus waktu | Tidak ada |
| Urutan soal | Diacak setiap kali bermain |
| Habis waktu | Jawaban yang sudah diketik ikut dinilai; kosong = salah |

### Predikat

| Nilai | Predikat |
|---|---|
| 90 - 100 | Sangat Baik |
| 80 - 89 | Baik |
| 70 - 79 | Cukup |
| < 70 | Perlu Belajar Lagi |

### Perbedaan mode

| | Mode Belajar | Mode Ujian |
|---|---|---|
| Umpan balik per soal | Ya (benar/salah + kunci) | Tidak |
| Kunci jawaban | Langsung terlihat | Baru di layar hasil |
| Tujuan | Media pembelajaran | Penilaian |

## 3. Alur layar

1. **Layar Judul**
   - Judul, tagline, tombol `Mulai`, tombol `Cara Main`
2. **Layar Aturan**
   - Jumlah soal, waktu per soal, cara menjawab
   - Pilih mode: `Belajar` / `Ujian`
   - Tombol `Mulai`
3. **Input Nama** (opsional)
   - Nama dipakai di layar hasil
4. **Layar Soal** (diulang 25 kali)
   - Header: `Soal 7/25`, progress bar, skor berjalan
   - Timer lingkaran 45 detik
   - Pertanyaan + petunjuk format jawaban
   - Kolom isian + tombol `Kirim` (Enter juga bisa)
5. **Layar Umpan Balik** (mode Belajar)
   - Benar / Salah
   - Kunci jawaban
   - Tombol `Lanjut`
6. **Rekap per Sila** (setiap 5 soal)
   - Contoh: "Sila ke-2 selesai — 4/5 benar"
7. **Layar Hasil**
   - Skor, jumlah benar, akurasi, nilai akhir, predikat
   - Rincian benar/salah per sila
   - Review semua jawaban (jawaban siswa vs kunci)
   - Tombol `Ulangi` dan `Kembali ke Judul`

## 4. Penilaian isian singkat

Setiap soal punya daftar jawaban yang diterima, bukan hanya satu.

Contoh:

```
Pertanyaan : Istilah Pancasila pertama kali dikemukakan pada 1 Juni 1945 oleh...
Kunci      : soekarno
Diterima   : soekarno, ir soekarno, bung karno, karno, presiden soekarno
```

Aturan pencocokan:

1. Huruf kecil semua, spasi dirapikan, tanda baca dihapus.
2. Cocokkan dengan daftar jawaban diterima.
3. Toleransi typo maksimal 1 huruf untuk kata sepanjang >= 6 huruf.
4. Angka dan kata dianggap sama: `2` = `dua`, `3` = `tiga`.
5. Jika salah / habis waktu, tampilkan kunci jawaban.

## 5. Struktur file (final)

```
game_PPKN/
  index.html          -> kerangka semua layar
  css/style.css       -> tampilan PILAR
  js/soal.js          -> bank soal (mudah diedit)
  js/game.js          -> logika permainan
  RENCANA.md          -> dokumen ini
  soal-draft.md       -> draft soal untuk direview
  README.md           -> panduan menjalankan & mengedit
  mockups/            -> arsip mockup tema (KODE 5 & PILAR)
```

Bank soal dipisah dari logika supaya kamu bisa mengoreksi soal tanpa
menyentuh kode permainan.

## 6. Rencana kerja 5 hari

| Hari | Target |
|---|---|
| 1 | Dokumen rencana + draft 25 soal -> direview |
| 2 | Kerangka HTML/CSS, layar judul, aturan, input nama |
| 3 | Logika soal, timer, mode Belajar/Ujian, penilaian isian |
| 4 | Layar hasil, rekap per sila, review jawaban, responsif HP |
| 5 | Uji coba menyeluruh, perbaikan, dokumentasi cara pakai |

## 7. Keputusan akhir & sisa pekerjaan

Sudah diputuskan:

- **Tema visual:** PILAR — terang, warna pop, neo-brutalist, papan mosaic 5×5.
- **Judul:** Pancasila dalam Kehidupan, dengan nama game PILAR.
- **Format:** 100% isian singkat, 25 soal, 5 per sila.
- **Mode:** Belajar & Ujian.
- **Pembahasan:** tidak ada, hanya kunci jawaban.
- **Timer:** 45 detik per soal, tanpa bonus kecepatan.
- **Progres refresh:** tidak disimpan (di luar cakupan).

Sisa pekerjaan:

- Koreksi isi 25 soal (menunggu review kamu).
- Uji coba di browser yang akan dipakai saat presentasi.
- Opsional: suara / musik latar kalau waktu cukup.
- Opsional: simpan progres di localStorage.
