/* ============================================================
   BANK SOAL — ZONK! PPKn Challenge
   25 soal pilihan ganda. Satu jawaban benar per soal.
   ------------------------------------------------------------
   Struktur:
   {
     id         : nomor soal (1-25)
     pertanyaan : teks soal
     pilihan    : array 4 pilihan (A, B, C, D)
     jawaban    : indeks jawaban benar (0 = A, 1 = B, 2 = C, 3 = D)
     pembahasan : penjelasan singkat
   }
   ------------------------------------------------------------
   Ingin mengedit soal? Cukup ubah data di bawah, tidak perlu
   menyentuh js/game.js.
   ============================================================ */

const BANK_SOAL = [
  {
    id: 1,
    pertanyaan: 'Apa dasar negara Republik Indonesia?',
    pilihan: ['Pancasila', 'UUD 1945', 'Proklamasi', 'Sumpah Pemuda'],
    jawaban: 0,
    pembahasan: 'Pancasila adalah dasar negara Indonesia. UUD 1945 adalah konstitusi, bukan dasar negara.'
  },
  {
    id: 2,
    pertanyaan: 'Berapa jumlah sila dalam Pancasila?',
    pilihan: ['Tiga', 'Empat', 'Lima', 'Enam'],
    jawaban: 2,
    pembahasan: 'Pancasila terdiri dari lima sila, mulai dari Ketuhanan Yang Maha Esa sampai Keadilan Sosial bagi Seluruh Rakyat Indonesia.'
  },
  {
    id: 3,
    pertanyaan: 'Apa lambang sila pertama Pancasila?',
    pilihan: ['Bintang', 'Rantai', 'Pohon beringin', 'Kepala banteng'],
    jawaban: 0,
    pembahasan: 'Bintang melambangkan sila pertama, Ketuhanan Yang Maha Esa.'
  },
  {
    id: 4,
    pertanyaan: 'Apa lambang sila kedua Pancasila?',
    pilihan: ['Padi dan kapas', 'Rantai', 'Bintang', 'Pohon beringin'],
    jawaban: 1,
    pembahasan: 'Rantai melambangkan sila kedua, Kemanusiaan yang Adil dan Beradab.'
  },
  {
    id: 5,
    pertanyaan: 'Apa lambang sila ketiga Pancasila?',
    pilihan: ['Kepala banteng', 'Bintang', 'Pohon beringin', 'Rantai'],
    jawaban: 2,
    pembahasan: 'Pohon beringin melambangkan sila ketiga, Persatuan Indonesia.'
  },
  {
    id: 6,
    pertanyaan: 'Apa lambang sila keempat Pancasila?',
    pilihan: ['Rantai', 'Padi dan kapas', 'Bintang', 'Kepala banteng'],
    jawaban: 3,
    pembahasan: 'Kepala banteng melambangkan sila keempat, Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan.'
  },
  {
    id: 7,
    pertanyaan: 'Apa lambang sila kelima Pancasila?',
    pilihan: ['Pohon beringin', 'Padi dan kapas', 'Rantai', 'Bintang'],
    jawaban: 1,
    pembahasan: 'Padi dan kapas melambangkan sila kelima, Keadilan Sosial bagi Seluruh Rakyat Indonesia.'
  },
  {
    id: 8,
    pertanyaan: 'Apa makna semboyan Bhinneka Tunggal Ika?',
    pilihan: [
      'Berbeda-beda tetapi tetap satu',
      'Bersatu karena memiliki budaya sama',
      'Mengutamakan satu kelompok',
      'Menghindari perbedaan'
    ],
    jawaban: 0,
    pembahasan: 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu.'
  },
  {
    id: 9,
    pertanyaan: 'Apa konstitusi yang berlaku di Indonesia?',
    pilihan: ['Pancasila', 'Piagam Jakarta', 'Dekrit Presiden', 'UUD 1945'],
    jawaban: 3,
    pembahasan: 'UUD 1945 adalah konstitusi atau hukum dasar yang berlaku di Indonesia.'
  },
  {
    id: 10,
    pertanyaan: 'Apa bentuk negara Indonesia?',
    pilihan: ['Negara Kesatuan Republik Indonesia', 'Negara serikat', 'Kerajaan', 'Negara federasi'],
    jawaban: 0,
    pembahasan: 'Indonesia berbentuk Negara Kesatuan Republik Indonesia (NKRI).'
  },
  {
    id: 11,
    pertanyaan: 'Apa isi pokok Pasal 27 ayat (1) UUD 1945?',
    pilihan: [
      'Setiap warga negara wajib mengikuti pendidikan tinggi',
      'Semua warga negara memiliki kedudukan yang sama di hadapan hukum dan pemerintahan',
      'Setiap warga negara wajib menjadi pegawai negeri',
      'Semua warga negara harus memiliki pekerjaan yang sama'
    ],
    jawaban: 1,
    pembahasan: 'Pasal 27 ayat (1) menjamin kesamaan kedudukan warga negara di hadapan hukum dan pemerintahan.'
  },
  {
    id: 12,
    pertanyaan: 'Apa hak warga negara yang dijelaskan dalam Pasal 31 ayat (1) UUD 1945?',
    pilihan: ['Hak memiliki perusahaan', 'Hak menjadi pejabat', 'Hak mendapatkan pendidikan', 'Hak menguasai wilayah'],
    jawaban: 2,
    pembahasan: 'Pasal 31 ayat (1) menyatakan bahwa setiap warga negara berhak mendapatkan pendidikan.'
  },
  {
    id: 13,
    pertanyaan: 'Apa yang dijamin oleh Pasal 29 ayat (2) UUD 1945?',
    pilihan: [
      'Kebebasan memiliki kendaraan',
      'Kebebasan memilih pekerjaan tertentu',
      'Kewajiban mengikuti organisasi',
      'Kemerdekaan penduduk untuk memeluk agama dan beribadah menurut agama serta kepercayaannya'
    ],
    jawaban: 3,
    pembahasan: 'Pasal 29 ayat (2) menjamin kemerdekaan penduduk untuk memeluk agama dan beribadah menurut agama serta kepercayaannya.'
  },
  {
    id: 14,
    pertanyaan: 'Apa kebebasan yang dijamin Pasal 28E ayat (3) UUD 1945?',
    pilihan: [
      'Kebebasan berserikat, berkumpul, dan mengeluarkan pendapat',
      'Kebebasan melanggar aturan',
      'Kebebasan mengambil hak orang lain',
      'Kebebasan mengabaikan hukum'
    ],
    jawaban: 0,
    pembahasan: 'Pasal 28E ayat (3) menjamin kebebasan berserikat, berkumpul, dan mengeluarkan pendapat.'
  },
  {
    id: 15,
    pertanyaan: 'Musyawarah untuk mencapai mufakat sesuai dengan sila keberapa?',
    pilihan: ['Sila pertama', 'Sila kedua', 'Sila keempat', 'Sila kelima'],
    jawaban: 2,
    pembahasan: 'Musyawarah untuk mencapai mufakat adalah pengamalan sila keempat.'
  },
  {
    id: 16,
    pertanyaan: 'Apa manfaat utama gotong royong?',
    pilihan: [
      'Memperbanyak persaingan',
      'Meringankan pekerjaan dan mempererat kebersamaan',
      'Mengutamakan kepentingan pribadi',
      'Membatasi hubungan sosial'
    ],
    jawaban: 1,
    pembahasan: 'Gotong royong meringankan pekerjaan sekaligus mempererat kebersamaan.'
  },
  {
    id: 17,
    pertanyaan: 'Manakah contoh kewajiban warga negara?',
    pilihan: [
      'Mematuhi peraturan dan hukum yang berlaku',
      'Mendapatkan pelayanan pendidikan',
      'Mendapatkan perlindungan hukum',
      'Menyampaikan pendapat'
    ],
    jawaban: 0,
    pembahasan: 'Mematuhi peraturan dan hukum yang berlaku adalah kewajiban warga negara.'
  },
  {
    id: 18,
    pertanyaan: 'Bagaimana sikap yang tepat ketika teman sedang menjalankan ibadah?',
    pilihan: [
      'Mengganggunya',
      'Mengejek keyakinannya',
      'Memaksanya mengikuti agama lain',
      'Menghormati dan tidak mengganggu ibadahnya'
    ],
    jawaban: 3,
    pembahasan: 'Menghormati dan tidak mengganggu ibadah orang lain adalah wujud toleransi.'
  },
  {
    id: 19,
    pertanyaan: 'Kapan peristiwa Sumpah Pemuda diperingati?',
    pilihan: ['17 Agustus 1945', '1 Juni 1945', '28 Oktober 1928', '10 November 1945'],
    jawaban: 2,
    pembahasan: 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.'
  },
  {
    id: 20,
    pertanyaan: 'Apa bahasa persatuan bangsa Indonesia?',
    pilihan: ['Bahasa daerah', 'Bahasa Indonesia', 'Bahasa Inggris', 'Bahasa Melayu daerah'],
    jawaban: 1,
    pembahasan: 'Bahasa Indonesia adalah bahasa persatuan bangsa Indonesia.'
  },
  {
    id: 21,
    pertanyaan: 'Apa lambang negara Indonesia?',
    pilihan: ['Garuda Pancasila', 'Burung merpati', 'Harimau', 'Burung elang'],
    jawaban: 0,
    pembahasan: 'Lambang negara Indonesia adalah Garuda Pancasila.'
  },
  {
    id: 22,
    pertanyaan: 'Apa warna bendera negara Indonesia?',
    pilihan: ['Merah dan kuning', 'Putih dan biru', 'Merah dan putih', 'Hijau dan putih'],
    jawaban: 2,
    pembahasan: 'Bendera Indonesia berwarna merah dan putih.'
  },
  {
    id: 23,
    pertanyaan: 'Apa lagu kebangsaan Indonesia?',
    pilihan: ['Bagimu Negeri', 'Garuda Pancasila', 'Hari Merdeka', 'Indonesia Raya'],
    jawaban: 3,
    pembahasan: 'Lagu kebangsaan Indonesia adalah Indonesia Raya.'
  },
  {
    id: 24,
    pertanyaan: 'Semboyan Bhinneka Tunggal Ika berasal dari karya sastra apa?',
    pilihan: ['Negarakertagama', 'Kakawin Sutasoma', 'Pararaton', 'Arjunawiwaha'],
    jawaban: 1,
    pembahasan: 'Bhinneka Tunggal Ika diambil dari Kakawin Sutasoma karya Mpu Tantular.'
  },
  {
    id: 25,
    pertanyaan: 'Menurut Pasal 1 ayat (2) UUD 1945, kedaulatan berada di tangan siapa?',
    pilihan: ['Presiden', 'DPR', 'Mahkamah Agung', 'Rakyat'],
    jawaban: 3,
    pembahasan: 'Pasal 1 ayat (2) UUD 1945 menyatakan bahwa kedaulatan berada di tangan rakyat.'
  }
];
