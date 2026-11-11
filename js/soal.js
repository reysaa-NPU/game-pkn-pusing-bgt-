/* ============================================================
   BANK SOAL — ZONK! PPKn Challenge
   30 soal pilihan ganda. Satu jawaban benar per soal.
   ------------------------------------------------------------
   Struktur:
   {
     id         : nomor soal (1-30)
     pertanyaan : teks soal
     pilihan    : array 4 pilihan (A, B, C, D)
     jawaban    : indeks jawaban benar (0 = A, 1 = B, 2 = C, 3 = D)
     pembahasan : penjelasan singkat
   }
   ------------------------------------------------------------
   Setiap sesi memakai 25 soal acak dari bank ini (tanpa ulang),
   sehingga nilai maksimal tetap 100.
   ------------------------------------------------------------
   Ingin mengedit soal? Cukup ubah data di bawah, tidak perlu
   menyentuh js/game.js.
   ============================================================ */

const BANK_SOAL = [
  /* ================= PANCASILA ================= */
  {
    id: 1,
    pertanyaan: 'Pancasila berkedudukan sebagai ideologi terbuka. Maksud dari ideologi terbuka adalah...',
    pilihan: [
      'Nilai-nilainya dapat diubah sewaktu-waktu sesuai keinginan penguasa',
      'Bersumber dari budaya asing yang masuk ke Indonesia',
      'Nilai dasarnya tetap, tetapi penjabaran dan pengamalannya dapat dikembangkan secara dinamis',
      'Menutup diri dari segala bentuk pengaruh modernisasi global'
    ],
    jawaban: 2,
    pembahasan: 'Ideologi terbuka berarti nilai dasar Pancasila tetap (tidak berubah), namun penjabaran dan operasionalisasinya bersifat fleksibel dan dinamis mengikuti perkembangan zaman tanpa mengubah nilai esensialnya.'
  },
  {
    id: 2,
    pertanyaan: 'Di tengah arus globalisasi, ancaman terhadap nilai-nilai Pancasila dapat berupa masuknya budaya asing yang bertentangan dengan norma. Sikap selektif yang paling tepat adalah...',
    pilihan: [
      'Menolak seluruh kebudayaan asing yang masuk ke Indonesia',
      'Menerima semua tren budaya asing agar tidak dianggap ketinggalan zaman',
      'Menyaring budaya asing yang masuk dengan tetap berpedoman pada nilai-nilai Pancasila',
      'Mengabaikan kebudayaan nasional demi fokus pada budaya global'
    ],
    jawaban: 2,
    pembahasan: 'Sikap selektif menghadapi globalisasi dilakukan dengan menyaring unsur-unsur budaya luar agar selaras dengan nilai luhur Pancasila dan kepribadian bangsa.'
  },
  {
    id: 3,
    pertanyaan: 'Perilaku gotong royong yang menjadi ciri khas masyarakat Indonesia merupakan cerminan pengamalan Pancasila, khususnya sila ke...',
    pilihan: ['Pertama', 'Kedua', 'Ketiga', 'Keempat'],
    jawaban: 2,
    pembahasan: 'Gotong royong mencerminkan semangat kebersamaan, persatuan, dan solidaritas sosial, yang merupakan esensi dari sila ketiga, yaitu "Persatuan Indonesia".'
  },
  {
    id: 4,
    pertanyaan: 'Kasus pelanggaran hak asasi manusia yang bertentangan dengan sila kemanusiaan yang adil dan beradab merupakan pengingkaran terhadap sila ke...',
    pilihan: ['Pertama', 'Kedua', 'Keempat', 'Kelima'],
    jawaban: 1,
    pembahasan: 'Sila kedua ("Kemanusiaan yang Adil dan Beradab") menekankan pentingnya pengakuan dan perlakuan harkat martabat manusia sesuai dengan nilai keadilan dan adab kemanusiaan.'
  },
  {
    id: 5,
    pertanyaan: 'Keputusan bersama melalui musyawarah untuk mufakat dalam kehidupan berorganisasi merupakan pengamalan sila ke...',
    pilihan: ['Pertama', 'Kedua', 'Ketiga', 'Empat'],
    jawaban: 3,
    pembahasan: 'Sila keempat berbunyi "Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan", yang nilai utamanya adalah musyawarah dan menghargai keputusan bersama.'
  },
  {
    id: 6,
    pertanyaan: 'Pancasila sebagai pandangan hidup bangsa berfungsi sebagai...',
    pilihan: [
      'Alat bagi pemerintah untuk mengontrol seluruh rakyat',
      'Petunjuk, pedoman, dan arah dalam mencapai cita-cita serta menyelesaikan berbagai persoalan bangsa',
      'Sumber hukum tertib formal yang kaku di dalam sistem peradilan',
      'Ideologi politik untuk partai yang sedang berkuasa'
    ],
    jawaban: 1,
    pembahasan: 'Sebagai pandangan hidup (way of life), Pancasila menjadi pedoman moral dan acuan tingkah laku sehari-hari bagi seluruh warga negara dalam bermasyarakat, berbangsa, dan bernegara.'
  },
  {
    id: 7,
    pertanyaan: 'Tindakan diskriminasi suku, agama, ras, dan antar-golongan (SARA) di lingkungan sekolah maupun masyarakat sangat bertentangan dengan nilai Pancasila, terutama sila...',
    pilihan: ['Pertama dan kedua', 'Kedua dan ketiga', 'Ketiga dan kelima', 'Keempat dan kelima'],
    jawaban: 1,
    pembahasan: 'Diskriminasi merusak nilai kemanusiaan (sila ke-2) dan memecah belah kerukunan serta persatuan bangsa (sila ke-3).'
  },
  {
    id: 8,
    pertanyaan: 'Perwujudan nilai instrumental dari Pancasila dapat ditemukan dalam bentuk...',
    pilihan: [
      'Keyakinan dasar yang abstrak di dalam hati nurani',
      'Norma hukum seperti Undang-Undang, Peraturan Pemerintah, dan Peraturan Daerah',
      'Kebiasaan turun-temurun suatu suku tertentu',
      'Pandangan hidup individu masing-masing warga'
    ],
    jawaban: 1,
    pembahasan: 'Nilai instrumental adalah penjabaran lebih lanjut dari nilai dasar Pancasila yang biasanya dituangkan dalam bentuk peraturan perundang-undangan dan kebijakan negara.'
  },
  {
    id: 9,
    pertanyaan: 'Menghargai hasil karya orang lain dan tidak menggunakan hak milik untuk hal-hal yang bersifat pemborosan merupakan butir pengamalan Pancasila sila ke...',
    pilihan: ['Kedua', 'Ketiga', 'Keempat', 'Kelima'],
    jawaban: 3,
    pembahasan: 'Sila kelima ("Keadilan Sosial bagi Seluruh Rakyat Indonesia") mengatur keseimbangan hak dan kewajiban, menghormati hak orang lain, serta sikap hemat dan menghargai karya cipta sesama.'
  },
  {
    id: 10,
    pertanyaan: 'Pancasila disahkan sebagai dasar negara Republik Indonesia oleh PPKI pada tanggal...',
    pilihan: ['1 Juni 1945', '18 Agustus 1945', '17 Agustus 1945', '22 Juni 1945'],
    jawaban: 1,
    pembahasan: 'PPKI (Panitia Persiapan Kemerdekaan Indonesia) mengesahkan Undang-Undang Dasar 1945 yang di dalamnya memuat Pembukaan UUD 1945 berisikan Pancasila sebagai dasar negara pada sidang tanggal 18 Agustus 1945.'
  },

  /* ============ UUD NRI TAHUN 1945: HAK & KEWAJIBAN ============ */
  {
    id: 11,
    pertanyaan: 'Setiap warga negara memiliki kedudukan yang sama di dalam hukum dan pemerintahan. Hal ini dijamin di dalam UUD 1945 Pasal...',
    pilihan: ['Pasal 27 ayat (1)', 'Pasal 27 ayat (2)', 'Pasal 28E ayat (1)', 'Pasal 30 ayat (1)'],
    jawaban: 0,
    pembahasan: 'Pasal 27 ayat (1) UUD 1945 menyatakan bahwa segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan dan wajib menjunjung hukum dan pemerintahan itu dengan tidak ada kecualinya.'
  },
  {
    id: 12,
    pertanyaan: 'Hak warga negara untuk mendapatkan pengajaran atau pendidikan diatur secara tegas di dalam UUD 1945 pada...',
    pilihan: ['Pasal 29 ayat (2)', 'Pasal 30 ayat (1)', 'Pasal 31 ayat (1)', 'Pasal 34 ayat (1)'],
    jawaban: 2,
    pembahasan: 'Pasal 31 ayat (1) UUD 1945 berbunyi: "Setiap warga negara berhak mendapatkan pendidikan."'
  },
  {
    id: 13,
    pertanyaan: 'Tindakan warga negara yang tidak membayar pajak tepat waktu merupakan bentuk...',
    pilihan: ['Pelanggaran hak', 'Pengingkaran kewajiban', 'Pembelaan negara', 'Kebebasan berpendapat'],
    jawaban: 1,
    pembahasan: 'Membayar pajak adalah kewajiban hukum warga negara. Tidak membayar pajak berarti mengingkari kewajiban yang telah diatur oleh undang-undang.'
  },
  {
    id: 14,
    pertanyaan: 'Berikut ini yang merupakan contoh bentuk pelanggaran hak warga negara adalah...',
    pilihan: [
      'Seorang siswa sengaja membolos sekolah saat jam pelajaran',
      'Pemerintah melarang warga negara untuk menyampaikan pendapat di muka umum secara damai',
      'Masyarakat tidak mematuhi rambu-rambu lalu lintas di jalan raya',
      'Warga menolak untuk mengikuti kegiatan kerja bakti di lingkungan sekitar'
    ],
    jawaban: 1,
    pembahasan: 'Hak warga negara untuk mengeluarkan pendapat dijamin oleh konstitusi. Jika hak tersebut dilarang oleh pihak yang berwenang secara sewenang-wenang, maka itu adalah pelanggaran hak.'
  },
  {
    id: 15,
    pertanyaan: 'Upaya penanganan dan pencegahan pelanggaran hak serta pengingkaran kewajiban dapat dimulai dari lingkungan terdekat, yaitu...',
    pilihan: ['Lingkungan internasional', 'Lingkungan keluarga dan sekolah', 'Lembaga peradilan tertinggi', 'Mahkamah Konstitusi'],
    jawaban: 1,
    pembahasan: 'Kesadaran hukum dan kepatuhan terhadap hak dan kewajiban paling efektif ditanamkan sejak dini melalui lingkungan terkecil, yaitu keluarga dan sekolah.'
  },
  {
    id: 16,
    pertanyaan: 'Hak untuk memeluk agama dan beribadah menurut agama dan kepercayaannya masing-masing dijamin di dalam UUD 1945 Pasal...',
    pilihan: ['Pasal 28', 'Pasal 29 ayat (1)', 'Pasal 29 ayat (2)', 'Pasal 30 ayat (2)'],
    jawaban: 2,
    pembahasan: 'Pasal 29 ayat (2) UUD 1945 menyatakan bahwa negara menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing dan untuk beribadah menurut agamanya dan kepercayaannya itu.'
  },
  {
    id: 17,
    pertanyaan: 'Hak dan kewajiban warga negara bersifat timbal balik (resiprokal), artinya...',
    pilihan: [
      'Warga negara mendapatkan hak terlebih dahulu baru menjalankan kewajiban',
      'Kewajiban hanya dijalankan jika hak sudah dipenuhi sepenuhnya tanpa batas',
      'Hak seseorang berkaitan erat dengan pelaksanaan kewajiban orang lain atau kewajiban diri sendiri',
      'Pemerintah memiliki hak penuh tanpa kewajiban kepada rakyat'
    ],
    jawaban: 2,
    pembahasan: 'Hak dan kewajiban saling berkaitan. Kita dapat menikmati hak kita karena orang lain (dan negara) telah menjalankan kewajibannya, begitu pula sebaliknya.'
  },
  {
    id: 18,
    pertanyaan: 'Salah satu bentuk kewajiban bela negara yang dapat dilakukan oleh pelajar SMK di sekolah adalah...',
    pilihan: [
      'Mengangkat senjata melawan negara tetangga',
      'Mengikuti pendidikan kewarganegaraan dan belajar dengan sungguh-sungguh',
      'Menjabat sebagai pemimpin militer tingkat daerah',
      'Menolak segala bentuk produk luar negeri secara mutlak'
    ],
    jawaban: 1,
    pembahasan: 'Berdasarkan UUD 1945 Pasal 27 ayat (3), setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara. Bagi pelajar, bentuk partisipasinya meliputi belajar dengan tekun, disiplin, dan mengikuti mata pelajaran Pendidikan Pancasila/Kewarganegaraan.'
  },
  {
    id: 19,
    pertanyaan: 'Pengingkaran kewajiban warga negara umumnya disebabkan oleh faktor-faktor berikut, kecuali...',
    pilihan: [
      'Sikap egois atau mementingkan diri sendiri',
      'Rendahnya kesadaran hukum',
      'Tingginya rasa toleransi antarwarga masyarakat',
      'Penyalahgunaan kekuasaan oleh oknum tertentu'
    ],
    jawaban: 2,
    pembahasan: 'Tingginya rasa toleransi justru akan memperkuat persatuan dan kepatuhan sosial, bukan menjadi penyebab pengingkaran kewajiban.'
  },
  {
    id: 20,
    pertanyaan: 'Lembaga negara yang bertugas mengawasi jalannya undang-undang serta mengadili pelanggaran hukum di tingkat kasasi adalah...',
    pilihan: ['Mahkamah Konstitusi', 'Mahkamah Agung', 'Dewan Perwakilan Rakyat', 'Komisi Yudisial'],
    jawaban: 1,
    pembahasan: 'Mahkamah Agung (MA) merupakan pengadilan negara tertinggi yang berwenang mengadili pada tingkat kasasi dan menguji peraturan perundang-undangan di bawah undang-undang terhadap undang-undang.'
  },

  /* ============ BHINNEKA TUNGGAL IKA ============ */
  {
    id: 21,
    pertanyaan: 'Integrasi nasional adalah pembauran berbagai unsur yang berbeda sehingga menjadi satu kesatuan yang utuh. Faktor pendorong integrasi nasional adalah...',
    pilihan: [
      'Adanya rasa senasib dan sepenanggungan akibat sejarah masa lalu',
      'Munculnya sikap etnosentrisme yang tinggi pada setiap suku',
      'Perbedaan kebudayaan yang mencolok antarwilayah',
      'Adanya keinginan untuk memisahkan diri dari negara'
    ],
    jawaban: 0,
    pembahasan: 'Rasa senasib sepenanggungan (misalnya dalam sejarah perjuangan melawan penjajah) menjadi salah satu perekat utama pemersatu bangsa Indonesia.'
  },
  {
    id: 22,
    pertanyaan: 'Ancaman terhadap integrasi nasional yang menggunakan kekuatan bersenjata dan membahayakan kedaulatan negara dikategorikan sebagai ancaman...',
    pilihan: ['Nir-militer', 'Militer', 'Kultural', 'Ekonomi'],
    jawaban: 1,
    pembahasan: 'Ancaman militer adalah ancaman yang menggunakan kekuatan bersenjata yang terorganisasi dan dinilai mampu membahayakan kedaulatan negara, keutuhan wilayah, dan keselamatan segenap bangsa.'
  },
  {
    id: 23,
    pertanyaan: 'Masuknya gaya hidup individualisme, konsumtivisme, dan westernisasi yang berlebihan di kalangan remaja merupakan bentuk ancaman nir-militer di bidang...',
    pilihan: ['Politik', 'Ekonomi', 'Sosial budaya', 'Pertahanan keamanan'],
    jawaban: 2,
    pembahasan: 'Individualisme, gaya hidup konsumtif, dan westernisasi yang menggerus nilai budaya lokal berkaitan erat dengan ketahanan di bidang sosial budaya.'
  },
  {
    id: 24,
    pertanyaan: 'Sistem pertahanan dan keamanan negara yang bersifat semesta melibatkan seluruh warga negara, wilayah, dan sumber daya nasional lainnya dikenal dengan sistem...',
    pilihan: [
      'Pertahanan konvensional',
      'Pertahanan militer mandiri',
      'Sistem Pertahanan dan Keamanan Rakyat Semesta (Sishankamrata)',
      'Pertahanan zona maritim terbuka'
    ],
    jawaban: 2,
    pembahasan: 'Sishankamrata adalah strategi pertahanan negara Indonesia yang menempatkan TNI dan Polri sebagai kekuatan utama serta rakyat sebagai kekuatan pendukung.'
  },
  {
    id: 25,
    pertanyaan: 'Salah satu faktor penghambat integrasi nasional di tengah masyarakat Indonesia yang majemuk adalah...',
    pilihan: [
      'Adanya semangat gotong royong',
      'Penggunaan bahasa Indonesia sebagai bahasa persatuan',
      'Etnosentrisme (menganggap suku sendiri lebih baik dari suku lain)',
      'Sikap saling menghormati antarpemeluk agama'
    ],
    jawaban: 2,
    pembahasan: 'Etnosentrisme merupakan sikap yang mengagungkan budaya atau suku sendiri dan merendahkan budaya suku lain, sehingga dapat merusak keharmonisan integrasi nasional.'
  },

  /* ============ NKRI, HUKUM, DAN PERDAMAIAN DUNIA ============ */
  {
    id: 26,
    pertanyaan: 'Politik luar negeri Indonesia menganut prinsip "Bebas Aktif". Arti dari kata "Aktif" adalah...',
    pilihan: [
      'Bebas memihak salah satu blok kekuatan militer dunia',
      'Ikut serta secara aktif dalam mewujudkan perdamaian dunia dan ketertiban internasional',
      'Tidak ikut campur dalam urusan internal negara manapun dalam kondisi apa pun',
      'Menutup diri dari kerja sama ekonomi multilateral'
    ],
    jawaban: 1,
    pembahasan: 'Prinsip "Bebas" berarti Indonesia tidak memihak blok kekuatan tertentu, sedangkan "Aktif" berarti Indonesia berpartisipasi aktif menyelesaikan konflik internasional dan menjaga perdamaian dunia.'
  },
  {
    id: 27,
    pertanyaan: 'Peraturan hidup yang berakibat sanksinya berupa hukuman penjara atau denda yang tegas dan nyata dari badan resmi negara disebut...',
    pilihan: ['Norma kesusilaan', 'Norma kesopanan', 'Norma hukum', 'Norma agama'],
    jawaban: 2,
    pembahasan: 'Norma hukum memiliki sifat memaksa serta sanksi yang tegas dan nyata yang diberikan oleh aparat penegak hukum yang berwenang.'
  },
  {
    id: 28,
    pertanyaan: 'Berdasarkan sifatnya, hukum yang tidak dapat dikesampingkan oleh perjanjian yang dibuat oleh pihak-pihak yang bersangkutan disebut hukum...',
    pilihan: ['Pemaksa (dwingend recht)', 'Pelengkap (regelend recht)', 'Tertulis', 'Material'],
    jawaban: 0,
    pembahasan: 'Hukum pemaksa adalah hukum yang dalam keadaan bagaimana pun harus ditaati dan bersifat mengikat mutlak tanpa bisa disimpangi oleh kesepakatan pribadi.'
  },
  {
    id: 29,
    pertanyaan: 'Organisasi internasional tempat berkumpulnya berbagai negara di dunia yang bertujuan menjaga perdamaian dan keamanan internasional adalah...',
    pilihan: ['ASEAN', 'Perserikatan Bangsa-Bangsa (PBB)', 'OPEC', 'NATO'],
    jawaban: 1,
    pembahasan: 'PBB (United Nations) adalah organisasi internasional utama yang didirikan untuk memfasilitasi kerja sama dalam hukum internasional, keamanan internasional, dan perdamaian dunia.'
  },
  {
    id: 30,
    pertanyaan: 'Peran nyata Indonesia dalam menciptakan perdamaian dunia di kawasan Asia Tenggara diwujudkan melalui pembentukan organisasi...',
    pilihan: [
      'GNB (Gerakan Non-Blok)',
      'OKI (Organisasi Kerja Sama Islam)',
      'ASEAN (Association of Southeast Asian Nations)',
      'APEC'
    ],
    jawaban: 2,
    pembahasan: 'Indonesia merupakan salah satu negara pelopor pendiri ASEAN yang bertujuan mempercepat pertumbuhan ekonomi, kemajuan sosial, dan pengembangan kebudayaan serta stabilitas regional di kawasan Asia Tenggara.'
  }
];
