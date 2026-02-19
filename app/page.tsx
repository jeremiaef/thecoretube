"use client";
import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from "react";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { cards } from "./data/cards";

const categories = ["All", "Money", "Career", "Productivity", "Mindset", "Faith"];

const slideColors: Record<string, string> = {
  hook: "from-purple-600 to-indigo-700",
  insight: "from-blue-600 to-cyan-700",
  action: "from-orange-500 to-red-600",
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
            className={`bg-gradient-to-br ${slideColors[slide.type]} p-6 h-full flex flex-col justify-between relative overflow-y-auto`}
          >
            <div>
              {/* Progress bar */}
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

              {/* Category badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full ${categoryColors[currentCard.category]}`}
                />
                <span className="text-xs text-white/70">{currentCard.category}</span>
                <span className="text-xs text-white/50">• {currentCard.youtuber}</span>
              </div>

              {/* Card title on first slide */}
              {slideIdx === 0 && (
                <h2 className="text-sm font-medium text-white/80 mb-3">
                  {currentCard.title}
                </h2>
              )}

              {/* Slide title (for insight and action slides) */}
              {slide.title && (
                <h3 className="text-lg font-bold text-white mb-3">
                  {slide.title}
                </h3>
              )}
            </div>

            {/* Slide content */}
            <div className="flex-1 flex items-center">
              <div className="space-y-3">
                {slide.text.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed ${
                      slide.type === "hook"
                        ? "text-xl font-semibold"
                        : "text-base font-medium text-white/90"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-white/50">
                {currentCardIndex + 1} / {filtered.length}
              </span>
              <span className="text-xs text-white/50">
                Slide {slideIdx + 1} / {currentCard.slides.length}
              </span>
            </div>

            {/* Tap areas for slides */}
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