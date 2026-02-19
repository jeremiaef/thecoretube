export interface Slide {
  type: "hook" | "insight" | "action";
  title?: string;
  text: string;
}

export interface Card {
  id: number;
  category: string;
  youtuber: string;
  title: string;
  slides: Slide[];
}

export const cards: Card[] = [
  // === MONEY (1-4) ===
  {
    id: 1,
    category: "Money",
    youtuber: "Fellexandro Ruby",
    title: "5 Kebiasaan yang Bikin Kamu Tetap Miskin",
    slides: [
      {
        type: "hook",
        text: "💰 80% orang Indonesia gak punya tabungan darurat.\n\nArtinya kalau besok kena PHK, mayoritas orang cuma bertahan 1-2 bulan. Ini bukan soal gaji kecil — ini soal kebiasaan.",
      },
      {
        type: "insight",
        title: "Lifestyle Inflation",
        text: "Gaji naik 2 juta, pengeluaran naik 2 juta. Upgrade HP, langganan baru, makan di tempat lebih mahal. Hasilnya? Gaji besar tapi tetap gak bisa nabung.",
      },
      {
        type: "insight",
        title: "Gak Punya Budget = Bocor Terus",
        text: "Tanpa budget, uang 'mengalir' tanpa arah. Riset bilang orang tanpa budget spend 20-30% lebih banyak dari yang mereka sadari.",
      },
      {
        type: "insight",
        title: "Aturan 50/30/20",
        text: "50% kebutuhan (kos, makan, transport). 30% keinginan (hiburan, jajan). 20% tabungan & investasi. Simpel, tapi cuma 10% orang yang beneran jalanin.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Buka rekening terpisah khusus tabungan. Set auto-transfer 20% begitu gaji masuk. Gak perlu tunggu gaji besar — mulai dari berapa pun.\n\n🎬 Full video → Fellexandro Ruby",
      },
    ],
  },
  {
    id: 2,
    category: "Money",
    youtuber: "Alex Hormozi",
    title: "Cara Menghasilkan $100 Pertamamu",
    slides: [
      {
        type: "hook",
        text: "💸 Mau mulai cari uang sendiri tapi bingung dari mana?\n\nKebanyakan orang stuck karena mikir harus punya produk dulu. Padahal yang kamu butuhkan cuma 1 skill dan 1 orang yang mau bayar.",
      },
      {
        type: "insight",
        title: "Jual Skill, Bukan Produk",
        text: "Kamu bisa desain? Nulis? Edit video? Itu udah cukup. Gak perlu bikin brand atau produk fisik. Orang bayar solusi untuk masalah mereka — dan skill kamu adalah solusinya.",
      },
      {
        type: "insight",
        title: "Cari 1 Client Aja Dulu",
        text: "Jangan mikir 'gimana dapet 1000 customer.' Fokus dapet 1 orang yang mau bayar. DM 10 orang, tawarin jasamu. Kalau 1 dari 10 bilang iya, kamu udah mulai.",
      },
      {
        type: "insight",
        title: "Over-Deliver = Marketing Gratis",
        text: "Client pertama itu investasi. Kasih hasil 2x dari yang mereka harapkan. Mereka bakal cerita ke orang lain. Word of mouth > iklan berbayar di tahap awal.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tulis 3 skill yang kamu punya. Pilih 1. Cari 10 orang di Instagram yang butuh skill itu. DM mereka hari ini.\n\n🎬 Full video → Alex Hormozi",
      },
    ],
  },
  {
    id: 3,
    category: "Money",
    youtuber: "Raditya Dika",
    title: "Kesalahan Finansial yang Aku Sesali di Usia 20-an",
    slides: [
      {
        type: "hook",
        text: "💳 Pernah beli sesuatu yang sekarang kamu sesali?\n\nDi usia 20-an, banyak orang bikin keputusan finansial yang dampaknya terasa bertahun-tahun. Kabar baiknya — kamu bisa hindari itu.",
      },
      {
        type: "insight",
        title: "FOMO Spending Itu Nyata",
        text: "Temen beli iPhone baru, kamu ikut. Temen liburan, kamu ikut. Ini namanya social comparison spending — dan ini drain terbesar di usia 20-an. Hidupmu bukan highlight reel orang lain.",
      },
      {
        type: "insight",
        title: "Compound Interest Gak Nunggu Kamu",
        text: "Mulai investasi Rp500rb/bulan di usia 22 vs 30 — bedanya bisa ratusan juta di usia 50. Bukan soal nominal besar, tapi soal mulai lebih awal. Waktu adalah aset terbesar kamu.",
      },
      {
        type: "insight",
        title: "Otomasi Keuangan",
        text: "Jangan andalkan willpower. Begitu gaji masuk, auto-transfer ke: tabungan darurat, investasi, dan baru sisanya untuk spending. Sistem > disiplin.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Download app investasi (Bibit/Bareksa). Set auto-invest Rp100rb/bulan. Kecil? Iya. Tapi kamu udah mulai — dan itu yang paling penting.\n\n🎬 Full video → Raditya Dika",
      },
    ],
  },
  {
    id: 4,
    category: "Money",
    youtuber: "Graham Stephan",
    title: "Cara Menabung 70% dari Gajimu",
    slides: [
      {
        type: "hook",
        text: "🏦 Gimana caranya nabung 70% gaji tanpa hidup sengsara?\n\nRahasianya bukan di skip kopi Starbucks — tapi di potong pengeluaran BESAR yang kebanyakan orang gak sadar.",
      },
      {
        type: "insight",
        title: "Cut Big 3: Housing, Transport, Food",
        text: "3 pengeluaran ini biasanya 60-70% total spending. Cari kos yang lebih murah walau agak jauh, naik transportasi umum, dan masak sendiri. Hemat di sini = impact paling besar.",
      },
      {
        type: "insight",
        title: "Meal Prep = Cheat Code",
        text: "Masak 3-4 porsi di hari Minggu. Simpan di kulkas. Kamu hemat 3-5 juta/bulan DAN makan lebih sehat. Ini bukan soal pelit — ini soal intentional spending.",
      },
      {
        type: "insight",
        title: "Kaya = Income Minus Spending",
        text: "Orang dengan gaji 20 juta tapi spend 19 juta lebih miskin dari yang gaji 8 juta tapi spend 4 juta. Wealth diukur dari apa yang kamu simpan, bukan apa yang kamu hasilkan.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Track pengeluaran minggu ini. Tulis SEMUA — dari parkir sampai jajan. Kamu bakal kaget berapa banyak yang 'hilang' tanpa sadar.\n\n🎬 Full video → Graham Stephan",
      },
    ],
  },
  // === CAREER (5-8) ===
  {
    id: 5,
    category: "Career",
    youtuber: "Ngobrolin Startup",
    title: "Cara Dapet Kerja Tanpa Pengalaman",
    slides: [
      {
        type: "hook",
        text: "🚀 Fresh graduate tapi semua lowongan minta pengalaman 2+ tahun?\n\nIni jebakan klasik: butuh kerja untuk pengalaman, butuh pengalaman untuk kerja. Tapi ada jalan keluarnya.",
      },
      {
        type: "insight",
        title: "Portfolio > CV",
        text: "Recruiter spend rata-rata 7 detik lihat CV. Tapi portfolio yang bagus? Itu bikin mereka berhenti scroll. Bikin 2-3 project kecil yang tunjukkan skill kamu — itu lebih kuat dari IPK 3.9.",
      },
      {
        type: "insight",
        title: "Gratis Dulu, Bayaran Nanti",
        text: "Magang gratis atau freelance murah bukan eksploitasi kalau kamu punya strategi. Ambil 1-2 project, deliver dengan excellent, minta testimoni. Itu jadi modal untuk negotiate gaji lebih tinggi.",
      },
      {
        type: "insight",
        title: "Network > Apply Online",
        text: "70% posisi diisi lewat referral, bukan job portal. Ikut event, aktif di LinkedIn, DM orang yang kamu admire. 1 kopi bareng orang yang tepat bisa buka pintu yang 100 lamaran online gak bisa.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Update LinkedIn kamu. Bikin 1 post tentang apa yang lagi kamu pelajari. Follow dan comment di post 5 orang di industri yang kamu mau. Mulai dari visible.\n\n🎬 Full video → Ngobrolin Startup",
      },
    ],
  },
  {
    id: 6,
    category: "Career",
    youtuber: "Ali Abdaal",
    title: "Cara Menemukan Karir yang Kamu Suka",
    slides: [
      {
        type: "hook",
        text: "🧭 'Ikutin passion-mu' adalah saran yang overrated.\n\nRiset dari Cal Newport bilang: passion itu HASIL dari jadi jago di sesuatu, bukan sebaliknya. Jadi gimana cara nemuin karir yang tepat?",
      },
      {
        type: "insight",
        title: "Skill Dulu, Passion Menyusul",
        text: "Kamu gak suka sesuatu yang kamu gak jago. Coba banyak hal, invest waktu untuk jadi decent, dan passion akan muncul dari competence. Ini namanya craftsman mindset.",
      },
      {
        type: "insight",
        title: "Weekend Test",
        text: "Apa yang kamu rela kerjain di Saturday morning tanpa dibayar? Bukan berarti itu harus jadi karirmu — tapi itu clue soal apa yang genuinely menarik buat kamu.",
      },
      {
        type: "insight",
        title: "30-Day Skill Sprint",
        text: "Commit 30 hari untuk 1 skill baru. Belajar tiap hari minimal 30 menit. Di hari ke-30, kamu tau: ini mau dilanjutin atau bukan. Lebih baik dari bertahun-tahun overthinking.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Pilih 1 skill yang bikin kamu penasaran. Set timer 30 menit. Mulai belajar sekarang. Bukan besok, bukan Senin — sekarang.\n\n🎬 Full video → Ali Abdaal",
      },
    ],
  },
  {
    id: 7,
    category: "Career",
    youtuber: "Gita Savitri",
    title: "Skill yang Paling Dibutuhin di 2025",
    slides: [
      {
        type: "hook",
        text: "📊 World Economic Forum bilang 44% skill kerja bakal berubah dalam 5 tahun ke depan.\n\nKalau kamu cuma andelin ijazah tanpa upgrade skill, kamu bakal ketinggalan. Tapi skill apa yang harus diprioritasin?",
      },
      {
        type: "insight",
        title: "AI Literacy (Bukan Coding)",
        text: "Kamu gak perlu jadi programmer. Tapi kamu HARUS tau cara pakai ChatGPT, Midjourney, Notion AI, dll untuk kerja lebih efisien. Orang yang pakai AI > orang yang pintar tapi lambat.",
      },
      {
        type: "insight",
        title: "Storytelling & Komunikasi",
        text: "AI bisa generate konten, tapi belum bisa bikin orang nangis atau tertawa. Kemampuan menyampaikan ide dengan compelling — lewat tulisan, presentasi, atau video — ini makin mahal.",
      },
      {
        type: "insight",
        title: "Adaptability > Expertise",
        text: "Yang survive bukan yang paling pintar, tapi yang paling cepat belajar hal baru. Di dunia yang berubah cepat, learning speed adalah superpower yang sesungguhnya.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Pilih 1 AI tool (ChatGPT, Claude, Canva AI). Pakai untuk 1 tugas kerjamu hari ini. Rasakan bedanya. Itu langkah pertama jadi AI-literate.\n\n🎬 Full video → Gita Savitri",
      },
    ],
  },
  {
    id: 8,
    category: "Career",
    youtuber: "Simon Sinek",
    title: "Kenapa 'Why' Kamu Lebih Penting dari 'What'",
    slides: [
      {
        type: "hook",
        text: "🎯 Apple, Nike, dan Martin Luther King punya 1 kesamaan.\n\nMereka semua mulai dari WHY — kenapa mereka melakukan apa yang mereka lakukan. Dan ini yang bikin orang mau ikut.",
      },
      {
        type: "insight",
        title: "Golden Circle: WHY → HOW → WHAT",
        text: "Kebanyakan orang dan company mulai dari WHAT (produk). Yang inspiratif mulai dari WHY (tujuan). 'Kami percaya pada thinking different' lebih powerful dari 'Kami jual komputer.'",
      },
      {
        type: "insight",
        title: "Orang Beli WHY, Bukan WHAT",
        text: "Kamu beli Nike bukan karena sepatunya paling bagus — tapi karena kamu relate sama semangat 'Just Do It.' People don't buy what you do, they buy why you do it.",
      },
      {
        type: "insight",
        title: "Temukan WHY-mu",
        text: "Tanya: 'Kenapa aku bangun pagi untuk kerjain ini?' Kalau jawabannya cuma 'uang' — kamu belum nemu Why-mu. Why yang kuat bikin kamu bertahan saat everything else bilang berhenti.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tulis 1 kalimat: 'Aku percaya bahwa...' Isi dengan sesuatu yang genuinely kamu peduliin. Itu draft pertama dari personal Why-mu.\n\n🎬 Full video → Simon Sinek",
      },
    ],
  },
  // === PRODUCTIVITY (9-12) ===
  {
    id: 9,
    category: "Productivity",
    youtuber: "Satu Persen",
    title: "Cara Berhenti Prokrastinasi Selamanya",
    slides: [
      {
        type: "hook",
        text: "⏰ Kamu sering nunda kerjaan penting buat scroll HP?\n\nIni bukan karena kamu malas. Penelitian dari Fuschia Sirois bilang prokrastinasi itu masalah EMOSI — kamu menghindari perasaan gak nyaman.",
      },
      {
        type: "insight",
        title: "Prokrastinasi = Emotional Avoidance",
        text: "Tugas besar bikin cemas. Otak cari pelarian ke sesuatu yang kasih dopamine instan — sosmed, YouTube, game. Kamu gak butuh time management, kamu butuh emotion management.",
      },
      {
        type: "insight",
        title: "2-Minute Rule",
        text: "Kalau sesuatu bisa selesai dalam 2 menit, kerjain SEKARANG. Balas chat, cuci piring, kirim email. Ini train otak kamu untuk take action tanpa overthinking.",
      },
      {
        type: "insight",
        title: "Micro-Tasks: Pecah Jadi Kecil",
        text: "'Bikin skripsi' itu overwhelming. 'Tulis 1 paragraf' itu doable. Otak suka progress kecil — setiap checklist yang kamu centang kasih dopamine yang bikin mau lanjut.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tugas yang lagi kamu tunda sekarang — pecah jadi 3 langkah kecil. Kerjain langkah pertama aja. Cuma 5 menit. Biasanya begitu mulai, kamu bakal lanjut.\n\n🎬 Full video → Satu Persen",
      },
    ],
  },
  {
    id: 10,
    category: "Productivity",
    youtuber: "Ali Abdaal",
    title: "Sistem Produktivitas yang Gak Bikin Burnout",
    slides: [
      {
        type: "hook",
        text: "🔋 Hustle culture bilang 'grind 24/7.' Hasilnya? Burnout di usia 25.\n\nAli Abdaal, ex-doctor turned YouTuber, nemuin framework yang bikin produktif TANPA sengsara. Namanya Feel-Good Productivity.",
      },
      {
        type: "insight",
        title: "Energi > Disiplin",
        text: "Berhenti paksa diri kerja saat energi habis. Mulai dari: apa yang bikin kamu berenergi? Kerja di jam peak-mu, di tempat yang kamu suka, sama orang yang bikin semangat.",
      },
      {
        type: "insight",
        title: "3 Power: Play, Power, People",
        text: "Play = bikin kerjaan fun (gamification, challenge). Power = bikin progress yang visible (checklist, milestone). People = kerjain bareng orang lain (accountability partner).",
      },
      {
        type: "insight",
        title: "90/20 Rule",
        text: "Fokus 90 menit, istirahat 20 menit. Otak gak didesain untuk fokus 8 jam straight. Rest itu bukan malas — itu recharge. Produktivitas sustainable > sprint yang bikin collapse.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Besok pagi, kerjain tugas terpenting kamu di 90 menit pertama. Timer on, HP silent. Setelah 90 menit, reward dirimu. Rasakan bedanya.\n\n🎬 Full video → Ali Abdaal",
      },
    ],
  },
  {
    id: 11,
    category: "Productivity",
    youtuber: "Thomas Frank",
    title: "Cara Belajar 2x Lebih Cepat",
    slides: [
      {
        type: "hook",
        text: "📚 Kamu belajar 3 jam tapi besoknya lupa semua?\n\nMasalahnya bukan kamu bodoh — masalahnya kamu pakai metode belajar yang salah. Science udah tau metode mana yang beneran works.",
      },
      {
        type: "insight",
        title: "Active Recall > Baca Ulang",
        text: "Baca ulang kasih ilusi 'aku paham.' Tes dirimu sendiri — tutup buku, coba ingat apa yang baru dipelajari. Ini 2-3x lebih efektif dari highlight atau baca ulang.",
      },
      {
        type: "insight",
        title: "Spaced Repetition",
        text: "Review di hari 1, 3, 7, 30. Ini cara otak memindahkan info dari short-term ke long-term memory. App kayak Anki bisa bantu automasi jadwal review-nya.",
      },
      {
        type: "insight",
        title: "Feynman Technique",
        text: "Coba jelasin apa yang kamu pelajari ke anak kecil. Kalau gak bisa jelasin secara simpel, kamu belum beneran paham. Ini expose gap di pemahamanmu.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Setelah baca/nonton sesuatu edukatif, tutup dan tulis 3 hal yang kamu ingat tanpa lihat. Ini 5 menit yang bakal transform cara kamu belajar.\n\n🎬 Full video → Thomas Frank",
      },
    ],
  },
  {
    id: 12,
    category: "Productivity",
    youtuber: "Iman Usman",
    title: "Morning Routine yang Benar-Benar Works",
    slides: [
      {
        type: "hook",
        text: "🌅 Morning routine bukan soal bangun jam 5 pagi.\n\nOrang sukses gak sukses KARENA bangun pagi. Mereka sukses karena punya intentional start — dan kamu bisa bikin itu di jam berapapun.",
      },
      {
        type: "insight",
        title: "No HP 30 Menit Pertama",
        text: "Begitu bangun langsung cek HP = kamu kasih orang lain kontrol atas mood-mu. Notifikasi, berita negatif, chat yang bikin stres. 30 menit pertama itu untuk KAMU, bukan untuk dunia.",
      },
      {
        type: "insight",
        title: "MIT: Most Important Task",
        text: "Kerjain 1 tugas terpenting sebelum jam 10. Bukan email, bukan meeting — tapi deep work yang move the needle. Setelah itu, bahkan kalau sisa hari kacau, kamu udah productive.",
      },
      {
        type: "insight",
        title: "Gerak 10 Menit",
        text: "Gak perlu gym 1 jam. Jalan kaki, stretching, push-up 10x. Movement kasih sinyal ke otak: 'kita udah aktif.' Tubuh on = otak on = mood on.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Besok pagi: HP di meja (bukan kasur). Bangun, minum air, gerak 5 menit, kerjain 1 hal penting. Coba 7 hari dan lihat bedanya.\n\n🎬 Full video → Iman Usman",
      },
    ],
  },
  // === MINDSET (13-16) ===
  {
    id: 13,
    category: "Mindset",
    youtuber: "Merry Riana",
    title: "Mindset yang Bedain Orang Sukses dan Gagal",
    slides: [
      {
        type: "hook",
        text: "🧠 Thomas Edison gagal 1.000 kali sebelum bikin lampu. J.K. Rowling ditolak 12 penerbit.\n\nApa yang bikin mereka lanjut sementara orang lain menyerah? Jawabannya: mindset.",
      },
      {
        type: "insight",
        title: "Fixed vs Growth Mindset",
        text: "Fixed: 'Aku emang gak bisa matematika.' Growth: 'Aku belum bisa matematika.' Satu kata — 'belum' — mengubah segalanya. Carol Dweck riset ini selama 30 tahun di Stanford.",
      },
      {
        type: "insight",
        title: "Kegagalan = Data, Bukan Vonis",
        text: "Orang sukses gak lebih pintar. Mereka treat kegagalan sebagai feedback: 'Apa yang bisa dipelajari dari sini?' Sementara orang lain treat kegagalan sebagai bukti mereka gak mampu.",
      },
      {
        type: "insight",
        title: "Proses > Hasil",
        text: "Fokus di sistem, bukan goal. 'Aku mau nulis tiap hari' lebih powerful dari 'Aku mau nulis buku.' Goal bikin kamu nunggu finish line. Sistem bikin kamu enjoy the journey.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tulis 1 hal yang kamu 'gak bisa.' Tambah kata 'belum' di depannya. 'Aku belum bisa public speaking.' Rasakan bedanya. Itu growth mindset in action.\n\n🎬 Full video → Merry Riana",
      },
    ],
  },
  {
    id: 14,
    category: "Mindset",
    youtuber: "Mark Manson",
    title: "Seni untuk Berhenti Peduli Hal yang Salah",
    slides: [
      {
        type: "hook",
        text: "🤯 Kamu terlalu peduli sama hal yang gak penting.\n\nKomentar orang di sosmed, status teman yang liburan, pendapat orang yang bahkan gak kenal kamu. Energimu habis untuk hal-hal yang gak mengubah hidupmu.",
      },
      {
        type: "insight",
        title: "Energi Peduli Itu Terbatas",
        text: "Setiap hari kamu cuma punya sejumlah 'care' yang bisa dikasih. Kalau habis untuk drama, gosip, dan insecurity — gak ada sisa untuk hal yang beneran penting: keluarga, growth, dan tujuanmu.",
      },
      {
        type: "insight",
        title: "Pilih Masalahmu",
        text: "Happiness bukan dari zero masalah. Itu impossible. Happiness dari MILIH masalah mana yang worth kamu perjuangkan. Gym itu susah — tapi sehat itu worth it. Bisnis itu stress — tapi freedom itu worth it.",
      },
      {
        type: "insight",
        title: "5-Year Test",
        text: "Sebelum stress soal sesuatu, tanya: 'Apakah ini masih penting 5 tahun dari sekarang?' Kalau gak — let it go. Kalau iya — baru invest energimu di situ.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tulis 3 hal yang bikin kamu stress minggu ini. Untuk setiap satu, tanya: 'Ini penting 5 tahun lagi?' Coret yang gak penting. Fokus yang tersisa.\n\n🎬 Full video → Mark Manson",
      },
    ],
  },
  {
    id: 15,
    category: "Mindset",
    youtuber: "Hinata Shin",
    title: "Filosofi Jepang untuk Hidup Lebih Tenang",
    slides: [
      {
        type: "hook",
        text: "🇯🇵 Jepang punya tingkat stress kerja tertinggi di dunia. Tapi juga punya filosofi hidup paling damai.\n\nParadoks ini melahirkan konsep-konsep yang bisa kamu pakai sekarang juga.",
      },
      {
        type: "insight",
        title: "Ikigai: Alasan Bangun Pagi",
        text: "Irisan dari 4 hal: apa yang kamu suka, apa yang kamu jago, apa yang dunia butuhkan, dan apa yang bisa menghasilkan. Kamu gak perlu jawab 4-4 sekarang — mulai dari 1.",
      },
      {
        type: "insight",
        title: "Wabi-Sabi: Terima Ketidaksempurnaan",
        text: "Gak semua harus perfect baru mulai. Mangkuk retak di Jepang justru dihargai — karena retakan itu cerita. Hidup kamu gak perlu sempurna untuk bermakna.",
      },
      {
        type: "insight",
        title: "Kaizen: 1% Setiap Hari",
        text: "Improve sedikit setiap hari. 1% improvement per hari = 37x lebih baik dalam 1 tahun. Bukan revolusi — tapi evolusi konsisten yang hasilnya luar biasa.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Pilih 1 area hidupmu. Commit untuk improve 1% hari ini. Baca 1 halaman. Olahraga 5 menit. Tidur 15 menit lebih awal. Kaizen dimulai dari langkah sekecil apapun.\n\n🎬 Full video → Hinata Shin",
      },
    ],
  },
  {
    id: 16,
    category: "Mindset",
    youtuber: "Naval Ravikant",
    title: "Cara Menjadi Kaya Tanpa Beruntung",
    slides: [
      {
        type: "hook",
        text: "🎰 'Dia sukses karena beruntung.' Beneran?\n\nNaval Ravikant — angel investor yang invest di Twitter dan Uber sebelum booming — bilang ada cara untuk 'menciptakan' keberuntungan sendiri.",
      },
      {
        type: "insight",
        title: "Cari Kekayaan, Bukan Uang",
        text: "Uang = kamu kerja, kamu dibayar, stop kerja = stop dibayar. Kekayaan = aset yang menghasilkan SAAT kamu tidur. Bisnis, investasi, konten, kode — ini yang bikin rich, bukan gaji besar.",
      },
      {
        type: "insight",
        title: "3 Leverage Modern",
        text: "Code: bikin software yang bisa dipakai jutaan orang. Media: bikin konten yang kerja 24/7 buat kamu. Capital: pakai uang orang lain untuk grow. Pilih minimal 1.",
      },
      {
        type: "insight",
        title: "Specific Knowledge",
        text: "Bangun skill unik yang gak bisa diajarkan di sekolah. Kombinasi unik dari pengalaman, curiosity, dan passion kamu. Ini yang bikin kamu irreplaceable — dan irreplaceable = valuable.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Tanya dirimu: 'Apa yang aku bisa kerjain lebih baik dari kebanyakan orang, yang juga aku enjoy?' Tulis jawabannya. Itu clue untuk specific knowledge-mu.\n\n🎬 Full video → Naval Ravikant",
      },
    ],
  },
  // === FAITH (17-20) ===
  {
    id: 17,
    category: "Faith",
    youtuber: "Ps. Jeffrey Rachmat",
    title: "Cara Denger Suara Tuhan di Tengah Kebisingan",
    slides: [
      {
        type: "hook",
        text: "✝️ Pernah merasa doamu gak dijawab?\n\nMungkin bukan Tuhan yang diam — mungkin kita yang terlalu ribut untuk mendengar. Di dunia yang penuh notifikasi, gimana caranya dengerin suara-Nya?",
      },
      {
        type: "insight",
        title: "Tuhan Bicara Lewat Firman",
        text: "Feeling bisa menipu, keadaan bisa bikin bingung. Tapi Firman Tuhan itu konsisten. Kalau kamu mau denger Tuhan, mulai dari baca Firman-Nya — bukan cuma nunggu 'feeling led.'",
      },
      {
        type: "insight",
        title: "Saat Teduh = Relasi, Bukan Ritual",
        text: "Saat teduh bukan checklist rohani. Ini kayak ngobrol sama sahabat. Gak perlu lama — tapi perlu konsisten dan genuine. Quality > quantity. Hati yang terbuka > durasi yang panjang.",
      },
      {
        type: "insight",
        title: "Journaling Doa",
        text: "Tulis doamu. Tulis apa yang Tuhan taruh di hatimu. 3 bulan kemudian, baca lagi — kamu bakal takjub lihat berapa banyak yang dijawab. Ini membangun iman yang based on evidence.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Siapkan buku kecil. Tiap pagi tulis 1 doa dan 1 ayat. Malam hari, tulis 1 hal yang kamu syukuri. 7 hari aja — lihat apa yang terjadi di hatimu.\n\n🎬 Full video → Ps. Jeffrey Rachmat",
      },
    ],
  },
  {
    id: 18,
    category: "Faith",
    youtuber: "Jonathan Pokluda",
    title: "Kenapa Anak Muda Meninggalkan Gereja",
    slides: [
      {
        type: "hook",
        text: "⛪ 64% Gen Z yang dibesarkan di gereja, pergi setelah usia 18 tahun.\n\nIni bukan karena mereka benci Tuhan. Kebanyakan pergi karena merasa gereja gak relevan dengan hidup mereka.",
      },
      {
        type: "insight",
        title: "Relevansi, Bukan Hiburan",
        text: "Anak muda gak perlu gereja yang 'keren.' Mereka perlu gereja yang bantu mereka navigate kehidupan nyata — anxiety, relationship, purpose, career. Jawaban yang real untuk masalah yang real.",
      },
      {
        type: "insight",
        title: "Community > Sunday Service",
        text: "Iman gak bertumbuh di kursi auditorium aja. Iman bertumbuh di small group — di mana kamu bisa jujur, vulnerable, dan dikenal. Cari 3-5 orang yang bisa jadi circle rohani kamu.",
      },
      {
        type: "insight",
        title: "Doubt Itu Normal",
        text: "Pertanyaan dan keraguan bukan tanda iman lemah. Itu tanda iman yang mau bertumbuh. Thomas meragukan kebangkitan Yesus — dan Yesus gak marah, Dia menunjukkan diri-Nya.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Ajak 1 teman untuk ngopi dan ngobrol soal iman — jujur, tanpa topeng. Kalau belum punya circle kayak gitu, cari small group di gerejamu. Iman butuh community.\n\n🎬 Full video → Jonathan Pokluda",
      },
    ],
  },
  {
    id: 19,
    category: "Faith",
    youtuber: "Ps. Philip Mantofa",
    title: "Cara Tetap Beriman di Tengah Kesulitan",
    slides: [
      {
        type: "hook",
        text: "🕊️ 'Kalau Tuhan baik, kenapa hidup terasa berat banget?'\n\nIni pertanyaan yang hampir setiap orang beriman pernah tanya. Dan jawabannya mungkin bukan yang kamu harapkan — tapi yang kamu butuhkan.",
      },
      {
        type: "insight",
        title: "Kesulitan ≠ Hukuman",
        text: "Banyak orang pikir cobaan = Tuhan marah. Padahal di Yakobus 1:2-4, kesulitan itu proses pembentukan. Emas diproses lewat api — begitu juga karakter kita.",
      },
      {
        type: "insight",
        title: "Padang Gurun Sebelum Istana",
        text: "Daud diurapi jadi raja, tapi habiskan bertahun-tahun dikejar Saul di padang gurun. Yusuf dapat mimpi, tapi masuk penjara dulu. Proses bukan penundaan — itu preparation.",
      },
      {
        type: "insight",
        title: "Mazmur: Doa di Titik Terendah",
        text: "Daud nulis Mazmur di saat paling gelap. 'Berapa lama lagi, TUHAN?' (Mzm 13:1). Kalau raja Daud aja pernah di titik itu, kamu gak sendirian. Dan kalau dia bisa lewati — kamu juga bisa.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Baca Mazmur 23 pelan-pelan. Tulis 1 kalimat yang paling bicara ke situasimu sekarang. Simpan di HP-mu. Baca lagi kalau terasa berat.\n\n🎬 Full video → Ps. Philip Mantofa",
      },
    ],
  },
  {
    id: 20,
    category: "Faith",
    youtuber: "Mike Todd",
    title: "Relationship Goals: Pacaran yang Sehat Menurut Alkitab",
    slides: [
      {
        type: "hook",
        text: "💑 Pacaran Kristen itu bukan soal daftar larangan.\n\nIni soal TUJUAN. Pertanyaannya bukan 'sejauh mana boleh?' tapi 'hubungan ini membawa kita ke mana?'",
      },
      {
        type: "insight",
        title: "Pertanyaan yang Benar",
        text: "Bukan 'Dia ganteng/cantik gak?' tapi 'Apakah hubungan ini membawa aku lebih dekat ke Tuhan?' Relationship yang sehat = dua orang yang sama-sama berlari ke arah Kristus.",
      },
      {
        type: "insight",
        title: "Boundaries = Perlindungan",
        text: "Boundaries bukan batasan yang bikin gak seru. Kamu pasang pagar di tepi jurang bukan karena benci kebebasan — tapi karena kamu menjaga sesuatu yang berharga di dalam.",
      },
      {
        type: "insight",
        title: "Green Flags to Look For",
        text: "Pasangan yang mendoakanmu (bukan cuma membuatmu senang). Yang accountable ke community. Yang mau bertumbuh bareng, bukan stuck bareng. Karakter > chemistry.",
      },
      {
        type: "action",
        title: "🎯 Mulai Hari Ini",
        text: "Single? Tulis 5 non-negotiable values untuk pasangan masa depanmu. In a relationship? Tanya pasanganmu: 'Gimana aku bisa bantu kamu lebih dekat ke Tuhan?'\n\n🎬 Full video → Mike Todd",
      },
    ],
  },
];