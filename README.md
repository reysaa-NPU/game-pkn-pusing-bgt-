# ZONK! PPKn Challenge

Game edukasi arcade yang menggabungkan **shell game** (menebak bola di bawah cup) dengan **25 soal pilihan ganda PPKn**. Dibuat dengan HTML, CSS, dan JavaScript vanilla — tanpa build step, tanpa framework, dan tanpa dependensi eksternal wajib.

> Temukan bola untuk mengumpulkan poin. Kena ZONK? Jawab soal PPKn atau gunakan poin untuk skip. Sesi selesai setelah 25 soal terpakai.

---

## Cara Menjalankan

### Cara tercepat
Buka `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari).

```bash
# Linux
xdg-open index.html

# macOS
open index.html

# Windows
start index.html
```

### Menggunakan server lokal (opsional)
Semua fitur berjalan dari `file://`, tetapi server lokal lebih nyaman untuk pengembangan:

```bash
# Python 3
python3 -m http.server 8000

# atau Node.js (jika tersedia)
npx serve .
```

Lalu buka <http://localhost:8000>.

> Font Google (Space Grotesk & Plus Jakarta Sans) dimuat dari internet. Jika offline, browser otomatis memakai font sistem — permainan tetap berjalan normal.

---

## Struktur File

```
game_PPKN/
├── index.html          # Semua layar: pembuka, arena, panel soal, hasil
├── css/
│   └── style.css       # Tema arcade, cup SVG, animasi, responsif, reduced-motion
├── js/
│   ├── soal.js         # BANK_SOAL — 25 pertanyaan PPKn (data terpisah)
│   └── game.js         # Logika permainan, shuffle, skor, audio, state
├── arsip-pilar/        # Dokumentasi proyek lama (PILAR Pancasila), tidak dipakai
└── README.md
```

### Mengedit soal
Cukup ubah array `BANK_SOAL` di `js/soal.js`. Setiap soal memakai format:

```js
{
  id: 1,
  pertanyaan: 'Apa dasar negara Republik Indonesia?',
  pilihan: ['Pancasila', 'UUD 1945', 'Proklamasi', 'Sumpah Pemuda'],
  jawaban: 0,        // indeks jawaban benar: 0=A, 1=B, 2=C, 3=D
  pembahasan: 'Pancasila adalah dasar negara Indonesia...'
}
```

Jangan mengubah `js/game.js` untuk mengganti soal. Bank soal divalidasi otomatis saat halaman dimuat (jumlah, 4 pilihan, indeks jawaban 0–3).

---

## Mekanisme Permainan

### 1. Pembuka
Tekan **MULAI BERMAIN**. Enam cup muncul, bola disembunyikan di salah satu cup, lalu cup diacak.

### 2. Menemukan bola
Pilih cup yang berisi bola:

- Cup terbuka dan bola terlihat.
- Muncul banner **“HEBAT! KAMU MENEMUKAN BOLA!”** + efek confetti.
- **+1 poin bola** (poin terpisah dari nilai PPKn).
- Tidak ada soal.
- Bola berpindah secara logis ke cup aktif lain, lalu semua cup diacak ulang otomatis.

### 3. Mendapat ZONK
Pilih cup kosong:

- Cup terbuka dan menampilkan **ZONK!**.
- Cup tersebut keluar dari arena → jumlah cup menjadi **5**.
- Panel soal PPKn terbuka. Cup **tidak** diacak selama soal aktif.
- Jawab soal atau gunakan skip.

### 4. Menjawab / skip soal

| Aksi | Nilai PPKn | Poin bola | Syarat |
|---|---|---|---|
| Jawaban benar | **+4** | — | — |
| Jawaban salah | **+0** | — | — |
| Skip soal | **+2** | **−1** | Minimal 1 poin bola |

- Skip selalu terlihat. Jika poin bola 0, tombol nonaktif.
- Setelah dikonfirmasi, jawaban benar disorot hijau, jawaban salah disorot merah, pembahasan dan kunci jawaban ditampilkan.
- Soal tidak bisa dijawab atau di-skip dua kali (dijaga oleh `state.questionResolved` dan validasi fase).
- Nilai di-clamp maksimal **100**; poin bola tidak pernah negatif.

### 5. COBA LAGI
Setelah soal selesai:

1. Panel soal ditutup.
2. Satu cup pengganti masuk dari sisi layar dengan animasi.
3. Jumlah cup kembali **6** dan cup baru dipastikan kosong.
4. Bola tetap berada di salah satu cup lama (tidak ada bola kedua).
5. Semua cup diacak ulang, lalu pemain bisa memilih lagi.

COBA LAGI **tidak** mereset poin bola, nilai, progres soal, atau riwayat jawaban.

### MULAI ULANG
Selama permainan, tombol **↺ MULAI ULANG** di header kanan (ikon saja di HP) mereset seluruh sesi setelah konfirmasi: poin, nilai, hitungan soal, cup, dan urutan soal kembali seperti baru. Tombol ini berbeda dari COBA LAGI yang hanya melanjutkan sesi.

### 6. Hasil akhir
Sesi berakhir setelah **25 soal** terjawab atau di-skip. Halaman hasil menampilkan:

- Total nilai PPKn dari 100 + predikat
- Jumlah benar, salah, dan skip
- Total bola ditemukan
- Sisa poin bola
- Persentase ketepatan
- Tombol **MAIN LAGI** (reset penuh) dan **Ke pembuka**

**MAIN LAGI** mereset poin, nilai, hitungan, jumlah cup, posisi bola, dan mengacak ulang urutan 25 soal.

---

## Detail Teknis

### State dan sumber kebenaran
- `state.ballCupId` adalah satu-satunya sumber lokasi bola. Tidak pernah ada lebih dari satu bola.
- Setiap cup punya `id` stabil dan `slot` logis. Posisi visual dihitung dari `slot` melalui `computeLayout()` dan `applyPositions()`.
- Fase permainan: `idle | shuffling | choosing | revealing | question | resolved | transitioning | result`.
- Cup hanya bisa diklik pada fase `choosing`. Klik saat shuffle, reveal, atau saat soal aktif diabaikan.
- `state.session` dipakai sebagai token untuk membatalkan proses async yang sudah kedaluwarsa (mis. saat mulai ulang).

### Shuffle cup
- **9–12 pertukaran** posisi acak per shuffle, masing-masing **70–110 ms**, ditambah jeda singkat.
- Pasangan cup tidak diulang berturut-turut; pemilihan pasangan memakai guard.
- Posisi logika ditukar lebih dulu, lalu cup dianimasikan ke posisi slot barunya dengan easing `cubic-bezier`.
- Posisi akhir visual selalu disamakan dengan posisi logika sebelum fase `choosing`.
- Tidak ada perubahan lokasi bola diam-diam selama atau setelah animasi.
- Algoritma pengacakan posisi cup terpisah dari Fisher–Yates yang dipakai untuk mengacak bank soal.

### Kecepatan shuffle
Default **Cepat**. Pilihan tersimpan di `localStorage`.

| Mode | Jumlah swap | Durasi per swap | Jeda akhir |
|---|---|---|---|
| Cepat (default) | 9–10 | 80–95 ms | ±310 ms |
| Normal | 10–11 | 95–110 ms | ±340 ms |

Konfigurasi ada di `CONFIG.SHUFFLE` pada `js/game.js`.

### Audio
Efek suara dibuat dengan **Web Audio API** (tanpa file audio eksternal): klik, shuffle tick, bola ditemukan, ZONK, benar, salah, skip, whoosh, dan fanfare. Tombol 🔊/🔇 di header mengatur mute; preferensi disimpan di `localStorage`.

### Aksesibilitas & responsif
- `prefers-reduced-motion: reduce` mematikan animasi panjang dan confetti.
- Focus ring terlihat, panel soal memakai `role="dialog"` dan `aria-modal`.
- Status permainan memakai `aria-live`.
- Desktop/laptop: 6 cup dalam satu baris.
- Tablet/HP: layout **3 kolom × 2 baris**, panel soal satu kolom dan dapat di-scroll bila melebihi tinggi layar.
- Tidak ada gambar eksternal; cup, bola, dan confetti dibuat dengan CSS/SVG.

---

## Pengujian yang Dilakukan

Pengujian otomatis berbasis Chrome DevTools Protocol (bukan bagian dari project) mencakup:

- ✅ 25 soal unik, setiap soal 4 pilihan, semua indeks jawaban valid.
- ✅ 6 cup aktif saat mulai dan setelah setiap shuffle; semua cup berada di dalam arena.
- ✅ Menemukan bola → `+1` poin, banner tampil, mini-ball tampil, bola berpindah ke cup lain setelah reshuffle.
- ✅ ZONK → cup keluar (6 → 5), panel soal terbuka, progres `SOAL 01 / 25`, 4 opsi.
- ✅ Jawaban benar → `+4` nilai, feedback hijau + pembahasan + kunci jawaban, tombol COBA LAGI.
- ✅ Jawaban salah → nilai tidak bertambah, opsi benar/salah disorot.
- ✅ Skip → `−1` poin bola, `+2` nilai, toast `SOAL DILEWATI! +2 NILAI`, pembahasan tampil.
- ✅ Skip nonaktif saat poin bola 0 (dengan tooltip).
- ✅ Double submit jawaban/skip diblokir; nilai dan progres tidak berubah.
- ✅ COBA LAGI → cup pengganti masuk, 6 cup kembali, bola tetap aktif, soal berikutnya dimulai.
- ✅ Sesi penuh 25 soal → 25 ID unik, nilai maksimal 100, benar 25, akurasi 100%, halaman hasil tampil.
- ✅ MAIN LAGI → semua counter reset, 6 cup kembali, bola baru, urutan soal diacak ulang.
- ✅ MULAI ULANG → reset penuh dari dalam permainan (dengan konfirmasi); header menyusut jadi ikon di HP.
- ✅ Klik cup saat shuffle diabaikan; bola tidak berpindah.
- ✅ Mobile 360–410 px → 3 kolom × 2 baris, header tidak overflow, panel soal muat di layar dengan opsi satu kolom.
- ✅ Tidak ada error JavaScript di console.

Catatan pengukuran: **ketepatan** dihitung dari `benar / (benar + salah)`, yaitu hanya soal yang benar-benar dijawab. Skip tidak dihitung sebagai jawaban salah.

---

## Keterbatasan / Catatan

- Permainan dapat berjalan lebih lama dari 25 soal jika pemain terus menemukan bola; sesi hanya berakhir setelah **25 soal** terpakai, sesuai spesifikasi. Tidak ada batas waktu atau batas tebakan.
- Tidak ada backend, login, atau papan skor online. Semua data sesi hanya di memori; yang disimpan di `localStorage` hanya preferensi kecepatan dan mute.
- Bank soal berisi tepat 25 soal, sehingga setiap sesi memakai seluruh bank (urutan berbeda).
- Audio memerlukan interaksi pengguna pertama (klik MULAI BERMAIN) karena kebijakan autoplay browser.
- Font Google memerlukan koneksi internet; tersedia fallback font sistem.
- Folder `arsip-pilar/` berisi dokumentasi proyek lama dan tidak dipakai oleh game ini.
