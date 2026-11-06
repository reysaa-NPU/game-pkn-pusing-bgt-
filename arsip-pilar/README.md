# PILAR — Pancasila dalam Kehidupan

Game kuis + puzzle tentang Pancasila untuk siswa SMA/SMK.
Dibuat dengan HTML, CSS, dan JavaScript murni — tanpa instalasi, langsung
dibuka di browser.

---

## Cara menjalankan

**Paling gampang:** buka file `index.html` dengan klik dua kali.

Kalau browser memblokir sesuatu, jalankan server lokal dari folder ini:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

Game berjalan offline, kecuali font Google Fonts. Kalau internet mati,
font otomatis memakai font sistem dan game tetap berfungsi.

---

## Fitur

| Fitur | Keterangan |
|---|---|
| 25 soal | 5 soal untuk setiap sila, isian singkat |
| Timer | 45 detik per soal |
| Dua mode | **Belajar** (kunci langsung) dan **Ujian** (kunci di akhir) |
| Papan 5×5 | Setiap jawaban mengisi satu kotak; 5 baris = 5 sila |
| Rekap per sila | Muncul setiap 5 soal |
| Penilaian | Benar = 100 poin; nilai akhir = benar ÷ 25 × 100 |
| Predikat | Sangat Baik, Baik, Cukup, Perlu Belajar Lagi |
| Review | Semua jawaban dibandingkan dengan kunci di akhir |
| Responsif | Desktop, tablet, dan HP |
| Toleransi jawaban | Tidak peka huruf besar/kecil, tanda baca, typo 1 huruf |

### Perbedaan mode

- **Mode Belajar** — setelah menjawab, kunci dan status benar/salah langsung
  muncul. Cocok untuk media pembelajaran di kelas.
- **Mode Ujian** — benar/salah tidak dibocorkan. Papan hanya menandai soal
  yang sudah dijawab. Nilai dan kunci baru terbuka di layar hasil.

---

## Struktur file

```
game_PPKN/
├── index.html          # kerangka semua layar
├── css/
│   └── style.css       # tampilan
├── js/
│   ├── soal.js         # BANK SOAL — edit di sini
│   └── game.js         # logika permainan
├── soal-draft.md       # draft soal untuk direview
├── RENCANA.md          # catatan rencana & keputusan
└── mockups/            # mockup tema (arsip proses desain)
```

---

## Cara mengedit soal

Buka `js/soal.js`. Satu soal bentuknya seperti ini:

```js
{
  id: 1, sila: 1, jenis: 'Simbol',
  pertanyaan: 'Simbol sila pertama pada perisai Garuda Pancasila adalah...',
  kunci: 'Bintang',
  diterima: ['bintang', 'bintang emas', 'bintang kuning'],
  petunjuk: 'Jawab satu kata.'
}
```

- `kunci` — jawaban yang ditampilkan di layar.
- `diterima` — semua variasi yang dianggap benar. Tambahkan sebanyak mungkin
  variasi wajar (singkatan, nama lengkap, sinonim).
- `petunjuk` — muncul di bawah pertanyaan.
- `sila` — 1 sampai 5. Usahakan tetap 5 soal per sila.

Setelah mengedit, simpan lalu refresh browser.

---

## Cara mengubah aturan

Buka `js/game.js` bagian atas:

```js
const TOTAL_SOAL = 25;
const PER_SILA = 5;
const BATAS_WAKTU = 45; // detik
```

Kalau jumlah soal diubah, sesuaikan juga isi `js/soal.js` dan teks aturan
di `index.html`.

---

## Catatan sebelum dikumpulkan

1. Cek kembali 25 soal di `js/soal.js` (atau review `soal-draft.md`).
2. Ganti nama jika perlu — cari "PILAR" di `index.html` dan `README.md`.
3. Uji di browser yang akan dipakai saat presentasi.
4. Siapkan cadangan: screenshot layar hasil dan file ZIP project.
5. Kalau presentasi tanpa internet, font tetap aman (fallback sistem).

---

## Batasan yang diketahui

- Belum ada suara atau musik latar.
- Progres tidak tersimpan kalau halaman di-refresh di tengah sesi.
- Penilaian isian singkat bergantung pada daftar `diterima`. Kalau ada
  jawaban siswa yang benar tetapi ditolak, tambahkan ke daftar itu.
- Tidak ada backend / leaderboard. Semua berjalan di browser.
