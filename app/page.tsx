"use client";
import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from "react";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { cards } from "./data/cards";

const categories = ["All", "Money", "Career", "Productivity", "Mindset", "Faith"];

const categoryGradients: Record<string, string> = {
  Money: "from-emerald-900/80 via-green-900/60 to-teal-950/80",
  Career: "from-blue-900/80 via-indigo-900/60 to-sky-950/80",
  Productivity: "from-amber-900/80 via-yellow-900/60 to-orange-950/80",
  Mindset: "from-purple-900/80 via-violet-900/60 to-fuchsia-950/80",
  Faith: "from-rose-900/80 via-pink-900/60 to-red-950/80",
};

const categoryAccents: Record<string, string> = {
  Money: "text-emerald-400",
  Career: "text-blue-400",
  Productivity: "text-amber-400",
  Mindset: "text-purple-400",
  Faith: "text-rose-400",
};

const categoryBadgeBg: Record<string, string> = {
  Money: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Career: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Productivity: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Mindset: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Faith: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const slideTypeLabel: Record<string, string> = {
  hook: "💡 HOOK",
  insight: "📖 INSIGHT",
  action: "🎯 ACTION",
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({});
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);
  const [slideAnim, setSlideAnim] = useState<"left" | "right" | null>(null);
  const router = useRouter();

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

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
    const current = currentSlide[cardId] || 0;
    if (current < totalSlides - 1) {
      setSlideAnim("left");
      setTimeout(() => {
        setCurrentSlide((prev) => ({
          ...prev,
          [cardId]: current + 1,
        }));
        setSlideAnim(null);
      }, 150);
    }
  };

  const prevSlide = (cardId: number) => {
    const current = currentSlide[cardId] || 0;
    if (current > 0) {
      setSlideAnim("right");
      setTimeout(() => {
        setCurrentSlide((prev) => ({
          ...prev,
          [cardId]: current - 1,
        }));
        setSlideAnim(null);
      }, 150);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < filtered.length - 1) {
      setSwipeDirection("up");
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
        setSwipeDirection(null);
      }, 250);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setSwipeDirection("down");
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev - 1);
        setSwipeDirection(null);
      }, 250);
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
    if (e.key === "ArrowUp") { e.preventDefault(); prevCard(); }
    if (e.key === "ArrowDown") { e.preventDefault(); nextCard(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prevSlide(currentCard.id); }
    if (e.key === "ArrowRight") { e.preventDefault(); nextSlide(currentCard.id, currentCard.slides.length); }
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400 text-sm">Loading CoreTube...</p>
        </div>
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
  const gradient = categoryGradients[currentCard.category] || categoryGradients["Money"];
  const accent = categoryAccents[currentCard.category] || "text-cyan-400";
  const badgeBg = categoryBadgeBg[currentCard.category] || categoryBadgeBg["Money"];

  return (
    <div className="h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Core<span className="text-cyan-400">Tube</span>
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-white transition px-3 py-1 rounded-full border border-gray-800 hover:border-gray-600"
          >
            Logout
          </button>
        </div>
        <div className="max-w-md mx-auto px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-gray-300"
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
        {/* Card with vertical animation */}
        <div
          className={`flex-1 rounded-2xl overflow-hidden transition-all duration-300 ease-out select-none ${
            swipeDirection === "up"
              ? "-translate-y-12 opacity-0 scale-95"
              : swipeDirection === "down"
              ? "translate-y-12 opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
        >
          {/* Glassmorphic card */}
          <div
            className={`bg-gradient-to-br ${gradient} backdrop-blur-2xl border border-white/10 p-6 h-full flex flex-col justify-between relative rounded-2xl shadow-2xl`}
          >
            {/* Decorative blur circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/3 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Progress bar */}
              <div className="flex gap-1.5 mb-4">
                {currentCard.slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i === slideIdx
                        ? "bg-white shadow-sm shadow-white/50"
                        : i < slideIdx
                        ? "bg-white/40"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>

              {/* Category badge + youtuber */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeBg}`}
                >
                  {currentCard.category}
                </span>
                <span className="text-xs text-white/50">{currentCard.youtuber}</span>
              </div>

              {/* Card title on first slide */}
              {slideIdx === 0 && (
                <h2 className="text-sm font-medium text-white/60 mb-1">
                  {currentCard.title}
                </h2>
              )}

              {/* Slide type label */}
              <span className="text-xs text-white/30 font-mono">
                {slideTypeLabel[slide.type]}
              </span>
            </div>

            {/* Slide content with horizontal animation */}
            <div
              className={`flex-1 flex items-center relative z-10 transition-all duration-200 ease-out ${
                slideAnim === "left"
                  ? "-translate-x-8 opacity-0"
                  : slideAnim === "right"
                  ? "translate-x-8 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <div className="space-y-3 w-full">
                {slide.title && (
                  <h3 className={`text-xl font-bold ${accent}`}>
                    {slide.title}
                  </h3>
                )}

                {slide.text.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed ${
                      slide.type === "hook"
                        ? "text-lg font-semibold text-white"
                        : "text-base text-white/85"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex justify-between items-center mt-4 relative z-10">
              <span className="text-xs text-white/30 font-mono">
                {currentCardIndex + 1} / {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {currentCard.slides.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === slideIdx ? "bg-white scale-125" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tap areas */}
            <div className="absolute inset-0 flex pointer-events-none z-20">
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

        <div className="text-center text-gray-700 text-xs mt-2 font-mono">
          ↕ swipe/arrow ganti card • ↔ swipe/tap ganti slide
        </div>
      </main>
    </div>
  );
}