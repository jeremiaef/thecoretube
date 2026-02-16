"use client";
import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from "react";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const categories = ["All", "Money", "Career", "Productivity", "Mindset", "Faith"];

const cards = [
  // === MONEY ===
  {
    id: 1,
    category: "Money",
    youtuber: "Fellexandro Ruby",
    title: "5 Kebiasaan yang Bikin Kamu Tetap Miskin",
    slides: [
      { type: "hook", text: "💰 Tau gak? 80% orang Indonesia gak punya tabungan darurat." },
      { type: "insight", text: "Kebiasaan #1: Lifestyle inflation — gaji naik, pengeluaran ikut naik." },
      { type: "insight", text: "Kebiasaan #2: Gak punya budget. Uang masuk = uang keluar tanpa rencana." },
      { type: "insight", text: "Solusi: Terapkan aturan 50/30/20. Kebutuhan/Keinginan/Tabungan." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Fellexandro Ruby" },
    ],
  },
  {
    id: 2,
    category: "Money",
    youtuber: "Alex Hormozi",
    title: "Cara Menghasilkan $100 Pertamamu",
    slides: [
      { type: "hook", text: "💸 Mau mulai cari uang sendiri tapi bingung dari mana?" },
      { type: "insight", text: "Step 1: Jual skill, bukan produk. Semua orang punya skill yang bisa dijual." },
      { type: "insight", text: "Step 2: Cari 1 orang yang mau bayar. Bukan 1000, cukup 1 dulu." },
      { type: "insight", text: "Step 3: Deliver lebih dari ekspektasi. Testimoni pertama = marketing gratis." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Alex Hormozi" },
    ],
  },
  {
    id: 3,
    category: "Money",
    youtuber: "Raditya Dika",
    title: "Kesalahan Finansial yang Aku Sesali di Usia 20-an",
    slides: [
      { type: "hook", text: "💳 Pernah beli sesuatu yang sekarang kamu sesali? Kamu gak sendirian." },
      { type: "insight", text: "Kesalahan #1: Gak bedain 'butuh' dan 'mau'. FOMO spending itu nyata." },
      { type: "insight", text: "Kesalahan #2: Gak mulai investasi dari awal. Compound interest itu powerful." },
      { type: "insight", text: "Fix: Otomasi keuangan. Begitu gaji masuk, langsung split ke tabungan & investasi." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Raditya Dika" },
    ],
  },
  {
    id: 4,
    category: "Money",
    youtuber: "Graham Stephan",
    title: "Cara Menabung 70% dari Gajimu",
    slides: [
      { type: "hook", text: "🏦 Gimana caranya nabung 70% gaji tanpa hidup sengsara?" },
      { type: "insight", text: "Prinsip: Cut big expenses dulu — housing, transport, food. Bukan skip kopi." },
      { type: "insight", text: "Hack: Masak sendiri = hemat 3-5 juta/bulan. Meal prep di hari Minggu." },
      { type: "insight", text: "Mindset: Kaya bukan soal gaji besar, tapi soal selisih income vs spending." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Graham Stephan" },
    ],
  },
  // === CAREER ===
  {
    id: 5,
    category: "Career",
    youtuber: "Ngobrolin Startup",
    title: "Cara Dapet Kerja Tanpa Pengalaman",
    slides: [
      { type: "hook", text: "🚀 Fresh graduate tapi semua lowongan minta pengalaman?" },
      { type: "insight", text: "Rahasia #1: Bangun portfolio, bukan CV. Tunjukkan hasil kerja nyata." },
      { type: "insight", text: "Rahasia #2: Magang atau freelance gratis dulu. Pengalaman > Gaji di awal." },
      { type: "insight", text: "Rahasia #3: Network > Apply online. 70% kerja didapat lewat koneksi." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Ngobrolin Startup" },
    ],
  },
  {
    id: 6,
    category: "Career",
    youtuber: "Ali Abdaal",
    title: "Cara Menemukan Karir yang Kamu Suka",
    slides: [
      { type: "hook", text: "🧭 Bingung mau jadi apa? Passion itu ditemukan, bukan ditunggu." },
      { type: "insight", text: "Framework: Coba banyak hal kecil dulu. Passion muncul setelah kamu jago." },
      { type: "insight", text: "Tes: Kalau kamu rela ngerjain ini gratis di weekend, itu clue-nya." },
      { type: "insight", text: "Action: Commit 30 hari untuk 1 skill baru. Evaluasi setelahnya." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Ali Abdaal" },
    ],
  },
  {
    id: 7,
    category: "Career",
    youtuber: "Gita Savitri",
    title: "Skill yang Paling Dibutuhin di 2025",
    slides: [
      { type: "hook", text: "📊 Dunia kerja berubah drastis. Kamu udah siap?" },
      { type: "insight", text: "Skill #1: AI literacy. Bukan jadi programmer, tapi tau cara pakai AI tools." },
      { type: "insight", text: "Skill #2: Komunikasi & storytelling. AI bisa bikin konten, tapi belum bisa connect." },
      { type: "insight", text: "Skill #3: Adaptability. Yang cepat belajar > yang paling pintar." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Gita Savitri" },
    ],
  },
  {
    id: 8,
    category: "Career",
    youtuber: "Simon Sinek",
    title: "Kenapa 'Why' Kamu Lebih Penting dari 'What'",
    slides: [
      { type: "hook", text: "🎯 Tau gak kenapa Apple beda dari kompetitor? Bukan soal produk." },
      { type: "insight", text: "Golden Circle: WHY → HOW → WHAT. Kebanyakan orang mulai dari What." },
      { type: "insight", text: "Orang gak beli apa yang kamu jual. Mereka beli kenapa kamu menjualnya." },
      { type: "insight", text: "Tanya dirimu: Kenapa aku bangun pagi untuk kerja ini? Itu Why-mu." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Simon Sinek" },
    ],
  },
  // === PRODUCTIVITY ===
  {
    id: 9,
    category: "Productivity",
    youtuber: "Satu Persen",
    title: "Cara Berhenti Prokrastinasi Selamanya",
    slides: [
      { type: "hook", text: "⏰ Kamu sering nunda-nunda kerjaan? Ini bukan soal malas." },
      { type: "insight", text: "Prokrastinasi = masalah emosi, bukan manajemen waktu." },
      { type: "insight", text: "Teknik 2-Minute Rule: Kalau bisa selesai dalam 2 menit, langsung kerjain." },
      { type: "insight", text: "Pecah tugas besar jadi micro-tasks. Otak suka progress kecil." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Satu Persen" },
    ],
  },
  {
    id: 10,
    category: "Productivity",
    youtuber: "Ali Abdaal",
    title: "Sistem Produktivitas yang Gak Bikin Burnout",
    slides: [
      { type: "hook", text: "🔋 Hustle culture itu toxic. Produktif ≠ sibuk 24/7." },
      { type: "insight", text: "Feel-Good Productivity: Mulai dari energi, bukan disiplin paksa." },
      { type: "insight", text: "3 Power: Play (bikin fun), Power (bikin progress), People (bikin bareng)." },
      { type: "insight", text: "Hack: Time-block 90 menit fokus + 20 menit istirahat. Otak butuh recovery." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Ali Abdaal" },
    ],
  },
  {
    id: 11,
    category: "Productivity",
    youtuber: "Thomas Frank",
    title: "Cara Belajar 2x Lebih Cepat",
    slides: [
      { type: "hook", text: "📚 Belajar berjam-jam tapi gak nempel? Caramu mungkin salah." },
      { type: "insight", text: "Active recall > baca ulang. Tes dirimu sendiri, jangan cuma highlight." },
      { type: "insight", text: "Spaced repetition: Review di hari 1, 3, 7, 30. Ini cara otak menyimpan info." },
      { type: "insight", text: "Feynman Technique: Kalau gak bisa jelasin ke anak kecil, kamu belum paham." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Thomas Frank" },
    ],
  },
  {
    id: 12,
    category: "Productivity",
    youtuber: "Iman Usman",
    title: "Morning Routine yang Benar-Benar Works",
    slides: [
      { type: "hook", text: "🌅 Morning routine bukan soal bangun jam 5. Ini soal intentional start." },
      { type: "insight", text: "Rule #1: No HP 30 menit pertama. Dopamine pagi = fokus hancur seharian." },
      { type: "insight", text: "Rule #2: Kerjain MIT (Most Important Task) sebelum jam 10 pagi." },
      { type: "insight", text: "Rule #3: Gerak 10 menit. Jalan kaki, stretching, apapun. Tubuh on = otak on." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Iman Usman" },
    ],
  },
  // === MINDSET ===
  {
    id: 13,
    category: "Mindset",
    youtuber: "Merry Riana",
    title: "Mindset yang Bedain Orang Sukses dan Gagal",
    slides: [
      { type: "hook", text: "🧠 Kenapa ada orang yang gagal terus tapi akhirnya berhasil?" },
      { type: "insight", text: "Growth mindset: Percaya kemampuan bisa berkembang lewat usaha." },
      { type: "insight", text: "Orang sukses lihat kegagalan sebagai data, bukan vonis." },
      { type: "insight", text: "Action: Ganti 'Aku gak bisa' jadi 'Aku belum bisa'." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Merry Riana" },
    ],
  },
  {
    id: 14,
    category: "Mindset",
    youtuber: "Mark Manson",
    title: "Seni untuk Berhenti Peduli Hal yang Salah",
    slides: [
      { type: "hook", text: "🤯 Kamu terlalu peduli sama hal yang gak penting. Ini masalahnya." },
      { type: "insight", text: "Kita cuma punya energi terbatas. Pilih masalah mana yang worth dipeduliin." },
      { type: "insight", text: "Happiness bukan dari menghindari masalah, tapi dari memilih masalah yang tepat." },
      { type: "insight", text: "Tes: Tanya dirimu — 'Apakah ini masih penting 5 tahun dari sekarang?'" },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Mark Manson" },
    ],
  },
  {
    id: 15,
    category: "Mindset",
    youtuber: "Hinata Shin",
    title: "Filosofi Jepang untuk Hidup Lebih Tenang",
    slides: [
      { type: "hook", text: "🇯🇵 Kenapa orang Jepang bisa terlihat tenang di tengah kesibukan?" },
      { type: "insight", text: "Ikigai: Temukan irisan antara passion, skill, kebutuhan dunia, dan income." },
      { type: "insight", text: "Wabi-sabi: Terima ketidaksempurnaan. Gak semua harus perfect baru mulai." },
      { type: "insight", text: "Kaizen: Improve 1% setiap hari. Konsistensi kecil > lompatan besar." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Hinata Shin" },
    ],
  },
  {
    id: 16,
    category: "Mindset",
    youtuber: "Naval Ravikant",
    title: "Cara Menjadi Kaya Tanpa Beruntung",
    slides: [
      { type: "hook", text: "🎰 Kekayaan bukan soal keberuntungan. Ini soal leverage." },
      { type: "insight", text: "Cari kekayaan, bukan uang. Kekayaan = aset yang menghasilkan saat kamu tidur." },
      { type: "insight", text: "3 Leverage: Kode (software), Media (konten), Capital (uang orang lain)." },
      { type: "insight", text: "Bangun specific knowledge — skill unik yang gak bisa diajarkan di sekolah." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Naval Ravikant" },
    ],
  },
  // === FAITH ===
  {
    id: 17,
    category: "Faith",
    youtuber: "Ps. Jeffrey Rachmat",
    title: "Cara Denger Suara Tuhan di Tengah Kebisingan",
    slides: [
      { type: "hook", text: "✝️ Pernah merasa doamu gak dijawab? Mungkin kamu belum dengerin." },
      { type: "insight", text: "Tuhan bicara lewat Firman, bukan lewat feeling semata." },
      { type: "insight", text: "Kunci: Saat teduh bukan ritual, tapi relasi. Quality > quantity." },
      { type: "insight", text: "Praktik: Journaling doamu. Tulis apa yang Tuhan taruh di hatimu." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Ps. Jeffrey Rachmat" },
    ],
  },
  {
    id: 18,
    category: "Faith",
    youtuber: "Jonathan Pokluda",
    title: "Kenapa Anak Muda Meninggalkan Gereja",
    slides: [
      { type: "hook", text: "⛪ Gen Z makin jauh dari gereja. Tapi bukan karena benci Tuhan." },
      { type: "insight", text: "Masalah #1: Merasa gereja gak relevan dengan kehidupan nyata mereka." },
      { type: "insight", text: "Masalah #2: Butuh community yang authentic, bukan sekadar ritual Minggu." },
      { type: "insight", text: "Solusi: Cari small group. Iman bertumbuh lewat relasi, bukan cuma khotbah." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Jonathan Pokluda" },
    ],
  },
  {
    id: 19,
    category: "Faith",
    youtuber: "Ps. Philip Mantofa",
    title: "Cara Tetap Beriman di Tengah Kesulitan",
    slides: [
      { type: "hook", text: "🕊️ Kalau Tuhan baik, kenapa hidup terasa berat banget?" },
      { type: "insight", text: "Kesulitan bukan hukuman. Kadang itu proses pembentukan karakter." },
      { type: "insight", text: "Daud gak jadi raja dalam semalam. Ada padang gurun sebelum istana." },
      { type: "insight", text: "Praktik: Di saat susah, baca Mazmur. Daud juga pernah di titik terendah." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Ps. Philip Mantofa" },
    ],
  },
  {
    id: 20,
    category: "Faith",
    youtuber: "Mike Todd",
    title: "Relationship Goals: Pacaran yang Sehat Menurut Alkitab",
    slides: [
      { type: "hook", text: "💑 Pacaran Kristen itu bukan soal 'jangan ini jangan itu'. Ini soal tujuan." },
      { type: "insight", text: "Pertanyaan utama: Apakah hubungan ini membawa kamu lebih dekat ke Tuhan?" },
      { type: "insight", text: "Boundaries bukan batasan, tapi perlindungan. Kamu menjaga sesuatu yang berharga." },
      { type: "insight", text: "Green flag: Pasangan yang mendoakanmu, bukan cuma membuatmu senang." },
      { type: "cta", text: "🎬 Tonton full video di YouTube → Mike Todd" },
    ],
  },
];

const slideColors: Record<string, string> = {
  hook: "from-purple-600 to-indigo-700",
  insight: "from-blue-600 to-cyan-700",
  cta: "from-orange-500 to-red-600",
};

const categoryColors: Record<string, string> = {
  Money: "bg-green-500",
  Career: "bg-blue-500",
  Productivity: "bg-yellow-500",
  Mindset: "bg-purple-500",
  Faith: "bg-pink-500",
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({});
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);
  const router = useRouter();

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/landing");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  const filtered =
    activeCategory === "All"
      ? cards
      : cards.filter((c) => c.category === activeCategory);

  const currentCard = filtered.length > 0 ? filtered[currentCardIndex] : null;
  const getSlideIndex = (cardId: number) => currentSlide[cardId] || 0;

  const nextSlide = (cardId: number, totalSlides: number) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [cardId]: Math.min((prev[cardId] || 0) + 1, totalSlides - 1),
    }));
  };

  const prevSlide = (cardId: number) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [cardId]: Math.max((prev[cardId] || 0) - 1, 0),
    }));
  };

  const nextCard = () => {
    if (currentCardIndex < filtered.length - 1) {
      setSwipeDirection("up");
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
        setSwipeDirection(null);
      }, 200);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setSwipeDirection("down");
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev - 1);
        setSwipeDirection(null);
      }, 200);
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    isDragging.current = true;
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diffY = touchStartY.current - clientY;
    const diffX = touchStartX.current - clientX;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) nextCard();
        else prevCard();
      }
    } else {
      if (Math.abs(diffX) > 50 && currentCard) {
        if (diffX > 0) nextSlide(currentCard.id, currentCard.slides.length);
        else prevSlide(currentCard.id);
      }
    }
  };

  const onTouchStart = (e: TouchEvent) =>
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = (e: TouchEvent) =>
    handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
  const onMouseUp = (e: MouseEvent) => handleEnd(e.clientX, e.clientY);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!currentCard) return;
    if (e.key === "ArrowUp") prevCard();
    if (e.key === "ArrowDown") nextCard();
    if (e.key === "ArrowLeft") prevSlide(currentCard.id);
    if (e.key === "ArrowRight") nextSlide(currentCard.id, currentCard.slides.length);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentCardIndex(0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-cyan-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-500">Belum ada konten di kategori ini</p>
      </div>
    );
  }

  const slideIdx = getSlideIndex(currentCard.id);
  const slide = currentCard.slides[slideIdx];

  return (
    <div className="h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Core<span className="text-cyan-400">Tube</span>
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
        <div className="max-w-md mx-auto px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Fullscreen Card */}
      <main
        className="flex-1 pt-24 pb-4 px-4 max-w-md mx-auto w-full flex flex-col outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <div
          className={`flex-1 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 select-none ${
            swipeDirection === "up"
              ? "-translate-y-8 opacity-0"
              : swipeDirection === "down"
              ? "translate-y-8 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div
            className={`bg-gradient-to-br ${slideColors[slide.type]} p-6 h-full flex flex-col justify-between relative`}
          >
            <div>
              <div className="flex gap-1.5 mb-4">
                {currentCard.slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === slideIdx ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${categoryColors[currentCard.category]}`}
                />
                <span className="text-xs text-white/70">{currentCard.category}</span>
                <span className="text-xs text-white/50">• {currentCard.youtuber}</span>
              </div>

              {slideIdx === 0 && (
                <h2 className="text-sm font-medium text-white/80 mb-2">
                  {currentCard.title}
                </h2>
              )}
            </div>

            <div className="flex-1 flex items-center">
              <p className="text-2xl font-semibold leading-relaxed">{slide.text}</p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50">
                {currentCardIndex + 1} / {filtered.length}
              </span>
              <span className="text-xs text-white/50">
                Slide {slideIdx + 1} / {currentCard.slides.length}
              </span>
            </div>

            <div className="absolute inset-0 flex pointer-events-none">
              <div
                className="w-1/3 h-full pointer-events-auto cursor-pointer"
                onClick={() => prevSlide(currentCard.id)}
              />
              <div className="w-1/3 h-full" />
              <div
                className="w-1/3 h-full pointer-events-auto cursor-pointer"
                onClick={() =>
                  nextSlide(currentCard.id, currentCard.slides.length)
                }
              />
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-xs mt-2">
          ↕ Arrow up/down ganti card • ↔ Arrow left/right ganti slide
        </div>
      </main>
    </div>
  );
}