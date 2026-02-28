"use client";
import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useUserProgress } from "../hooks/useUserProgress";
import { useCards } from "../hooks/useCards";
import { useLikes } from "../hooks/useLikes";
import { useAudio } from "../hooks/useAudio";
import { useChallenge } from "../hooks/useChallenge";
import ShareModal from "../components/ShareModal";
import ChallengeModal from "../components/ChallengeModal";
import DoNowOverlay from "../components/DoNowOverlay";

const categories = ["All", "Money", "Career", "Productivity", "Mindset", "Faith"];

const slideTypeLabel: Record<string, string> = {
  hook: "HOOK",
  insight: "INSIGHT",
  action: "ACTION",
};

// Auto-highlight numbers, percentages, and **bold** markdown in text
function RichText({ text, className }: { text: string; className?: string }) {
  // Split by **bold** markers and number/percentage patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\d+[.,]?\d*\s*%|\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?(?:\s*(?:juta|ribu|rb|jam|hari|menit|x|X))?)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (/^\d/.test(part)) {
          return <span key={i} className="text-wd-accent font-bold">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// Split hook text into headline (first sentence) + body (rest)
function splitHook(text: string): { headline: string; body: string } {
  const match = text.match(/^(.+?[.!?])\s*([\s\S]*)$/);
  if (match && match[2].trim().length > 0) {
    return { headline: match[1].trim(), body: match[2].trim() };
  }
  return { headline: text.trim(), body: "" };
}

// Extract first prominent stat from text for callout display
function extractStat(text: string): string | null {
  const match = text.match(/\b(\d+(?:[.,]\d+)*\s*(?:%|x|X|juta|ribu|rb|jam|hari|menit)?)\b/);
  if (match && match[0].replace(/\D/g, "").length >= 2) return match[0].trim();
  return null;
}

// Noise grain overlay — makes flat dark surfaces feel like material
const grainStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay" as const,
  opacity: 0.035,
};

// Picks 1 action per card per day — consistent within a day, different tomorrow
function getDailyAction(cardId: number, actions: (string | { text: string; steps: string[]; time?: string })[]) {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const idx = (cardId * 31 + dayOfYear) % actions.length;
  return actions[idx];
}

// Normalize old string actions and new ActionOption into consistent shape
function normalizeAction(action: string | { text: string; steps: string[]; time?: string }): { text: string; steps: string[]; time?: string } {
  if (typeof action === "string") return { text: action, steps: [] };
  return action;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({});
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);
  const [slideAnim, setSlideAnim] = useState<"left" | "right" | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sessionCardCount, setSessionCardCount] = useState(0);
  const [justAcceptedId, setJustAcceptedId] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showDoNow, setShowDoNow] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ text: string; steps: string[]; time?: string } | null>(null);
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);
  const router = useRouter();

  const { progress, hasSharedToday, readCardIds, markCardRead, markSharedToday, incrementCardsRead } = useUserProgress(user);
  const { cards, loading: cardsLoading } = useCards(user?.id ?? null, readCardIds);
  const allCardIds = cards.map((c) => c.id);
  const { likeCounts, likedCards, toggleLike } = useLikes(user?.id ?? null, allCardIds);
  const { muted, toggleMute, startAudio } = useAudio(activeCategory);
  const { acceptChallenge, getStatus } = useChallenge(user?.id ?? null, allCardIds);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/");
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
        setCurrentSlide((prev) => ({ ...prev, [cardId]: current + 1 }));
        setSlideAnim(null);
      }, 150);
    }
  };

  const prevSlide = (cardId: number) => {
    const current = currentSlide[cardId] || 0;
    if (current > 0) {
      setSlideAnim("right");
      setTimeout(() => {
        setCurrentSlide((prev) => ({ ...prev, [cardId]: current - 1 }));
        setSlideAnim(null);
      }, 150);
    }
  };

  const advanceCard = () => {
    if (currentCard) markCardRead(currentCard.id);
    incrementCardsRead();
    setSwipeDirection("up");
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 250);
  };

  const nextCard = () => {
    if (currentCardIndex < filtered.length - 1) {
      const newCount = sessionCardCount + 1;
      setSessionCardCount(newCount);

      if (newCount >= 10 && !hasSharedToday) {
        setShowShareModal(true);
        return;
      }

      advanceCard();
    }
  };

  const handleShareConfirm = async () => {
    await markSharedToday();
    setShowShareModal(false);
    advanceCard();
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
    startAudio();
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

  const handleAcceptChallenge = (cardId: number, action: { text: string; steps: string[]; time?: string }) => {
    setPendingAction(action);
    setPendingCardId(cardId);
    setShowChallengeModal(true);
  };

  const handleDoNow = () => {
    if (pendingCardId && pendingAction) acceptChallenge(pendingCardId, pendingAction.text);
    setShowChallengeModal(false);
    setShowDoNow(true);
  };

  const handleLater = (when: string) => {
    if (pendingCardId && pendingAction) acceptChallenge(pendingCardId, pendingAction.text);
    // Store scheduled time in localStorage for now
    const key = `mission_when_${pendingCardId}`;
    localStorage.setItem(key, when);
  };

  const handleDoNowComplete = () => {
    setShowDoNow(false);
    setPendingAction(null);
    setPendingCardId(null);
    if (pendingCardId) {
      setJustAcceptedId(pendingCardId);
      setTimeout(() => setJustAcceptedId(null), 2500);
    }
  };

  if (loading || cardsLoading) {
    return (
      <div className="grid-bg min-h-screen text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-wd-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-wd-secondary text-sm tracking-wide">Loading weRdoers...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="grid-bg min-h-screen text-white flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="text-white font-bold text-lg">Kamu udah baca semua!</h2>
        <p className="text-wd-secondary text-sm leading-relaxed">
          Konten baru datang setiap hari. Coba kategori lain atau balik lagi besok.
        </p>
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {categories.filter((c) => c !== "All" && c !== activeCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="px-4 py-1.5 rounded-full text-sm bg-wd-surface text-wd-secondary border border-wd-border hover:border-wd-accent/30 hover:text-white transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const slideIdx = getSlideIndex(currentCard.id);
  const slide = currentCard.slides[slideIdx];
  const isActionSlide = slide.type === "action";
  const isLiked = likedCards.has(currentCard.id);
  const challengeStatus = getStatus(currentCard.id);
  const rawDailyAction =
    isActionSlide && slide.actions && slide.actions.length > 0
      ? getDailyAction(currentCard.id, slide.actions)
      : null;
  const dailyAction = rawDailyAction ? normalizeAction(rawDailyAction) : null;
  const likeCount = likeCounts[currentCard.id] || 0;

  return (
    <div className="grid-bg h-screen text-white overflow-hidden flex justify-center">
      {showShareModal && currentCard && (
        <ShareModal card={currentCard} onConfirm={handleShareConfirm} />
      )}

      {showChallengeModal && pendingAction && currentCard && (
        <ChallengeModal
          action={pendingAction}
          cardTitle={currentCard.title}
          onDoNow={handleDoNow}
          onLater={handleLater}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {showDoNow && pendingAction && currentCard && (
        <DoNowOverlay
          action={pendingAction}
          cardTitle={currentCard.title}
          onComplete={handleDoNowComplete}
          onClose={() => { setShowDoNow(false); }}
        />
      )}

      <div className="w-full max-w-md h-full flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-50 px-3 pt-3 pb-2">

        {/* Floating nav bar */}
        <div
          className="rounded-2xl bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#2A2A2A] px-4 py-2.5 flex justify-between items-center mb-2"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
        >
          <span className="text-sm font-bold tracking-tight text-white">
            DOERS <span className="text-wd-muted font-normal text-xs">beta</span>
          </span>
          <div className="flex items-center gap-2">
            {progress && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <span className="text-xs">🔥</span>
                <span className="text-xs text-orange-300 font-bold">{progress.streak_count}</span>
              </div>
            )}
            {hasSharedToday && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-wd-accent/10 border border-wd-accent/20">
                <span className="text-xs text-wd-accent">✓ shared</span>
              </div>
            )}
            <button
              onClick={toggleMute}
              className="text-xs px-2.5 py-1 rounded-full border border-[#2A2A2A] hover:border-wd-secondary transition text-wd-secondary"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-wd-muted hover:text-white transition px-3 py-1 rounded-full border border-[#2A2A2A] hover:border-wd-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-wd-accent/15 text-wd-accent border border-wd-accent/30"
                  : "bg-[#1A1A1A]/80 text-wd-secondary border border-[#2A2A2A] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </header>

      {/* Main */}
      <main
        className="flex-1 pb-4 px-4 pb-20 flex flex-col outline-none overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <div
          className={`flex-1 rounded-2xl overflow-hidden transition-all duration-250 ease-out select-none ${
            swipeDirection === "up"
              ? "-translate-y-12 opacity-0 scale-95"
              : swipeDirection === "down"
              ? "translate-y-12 opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
        >
          {/* Card */}
          <div className="bg-wd-surface border border-wd-border p-5 h-full flex flex-col relative rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(59,130,246,0.04)' }}
          >
            {/* Grain texture overlay */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-0" style={grainStyle} />

            {/* Ambient glow — shifts position per slide type */}
            {slide.type === "hook" && (
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
            )}
            {slide.type === "insight" && (
              <div className="absolute top-1/2 -left-8 w-64 h-64 -translate-y-1/2 rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
            )}
            {slide.type === "action" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
            )}

            <div className="relative z-10">
              {/* Progress bars */}
              <div className="flex gap-1.5 mb-4">
                {currentCard.slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                      i === slideIdx
                        ? "bg-wd-accent"
                        : i < slideIdx
                        ? "bg-wd-accent/40"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail — hook slide only, always reserves space */}
            {slideIdx === 0 && (
              <div className="relative z-10 mb-4 rounded-xl overflow-hidden" style={{ height: "210px" }}>
                {currentCard.image_url && !imgErrors.has(currentCard.id) ? (
                  <>
                    <img
                      src={currentCard.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const videoId = target.src.match(/vi\/([^/]+)\//)?.[1];
                        if (videoId && target.src.includes("maxresdefault")) {
                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        } else {
                          setImgErrors((prev) => new Set(prev).add(currentCard.id));
                        }
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                      <p className="text-white text-xs font-medium line-clamp-2 leading-snug">{currentCard.title}</p>
                    </div>
                  </>
                ) : (
                  /* Premium placeholder */
                  <div className="w-full h-full bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2 text-wd-muted">
                      <div className="w-4 h-px bg-wd-muted/40" />
                      <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Video Insight</span>
                      <div className="w-4 h-px bg-wd-muted/40" />
                    </div>
                    <p className="text-white/40 text-xs text-center px-6 leading-relaxed line-clamp-2">{currentCard.title}</p>
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10">
              {/* Category badge + youtuber */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-wd-accent/10 text-wd-accent border border-wd-accent/20">
                  {currentCard.category}
                </span>
                <span className="text-xs text-wd-muted">{currentCard.youtuber}</span>
              </div>

              {/* Slide type label */}
              <span className={`text-xs font-mono font-semibold tracking-widest ${
                isActionSlide ? "text-wd-accent" : "text-white/20"
              }`}>
                {slideTypeLabel[slide.type]}
              </span>
            </div>

            {/* Slide content */}
            <div
              className={`flex-1 flex items-center relative z-10 transition-all duration-200 ease-out ${
                slideAnim === "left"
                  ? "-translate-x-8 opacity-0"
                  : slideAnim === "right"
                  ? "translate-x-8 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {/* HOOK — headline big, body smaller, numbers electric blue */}
              {slide.type === "hook" && (
                <div className="space-y-3 w-full">
                  {slide.title && (
                    <RichText text={slide.title} className="block text-2xl font-bold text-white leading-snug" />
                  )}
                  {slide.text.split("\n\n").map((paragraph, i) => {
                    const { headline, body } = splitHook(paragraph);
                    return (
                      <div key={i} className="space-y-2">
                        <p className="text-2xl font-bold text-white leading-snug">
                          <RichText text={headline} />
                        </p>
                        {body && (
                          <p className="text-sm text-white/55 leading-relaxed">
                            <RichText text={body} />
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <p className="text-xs text-wd-muted tracking-widest uppercase pt-1">Swipe → to learn more</p>
                </div>
              )}

              {/* INSIGHT — quote-style, stat callout, decorative quote mark */}
              {slide.type === "insight" && (() => {
                const stat = extractStat(slide.text);
                return (
                  <div className="w-full space-y-3 relative">
                    {/* Decorative large quote mark */}
                    <div className="absolute -top-4 right-0 text-[120px] font-serif leading-none text-white pointer-events-none select-none"
                      style={{ opacity: 0.03 }}>
                      "
                    </div>

                    {slide.title && (
                      <h3 className="text-base font-semibold text-wd-accent uppercase tracking-widest">{slide.title}</h3>
                    )}

                    {/* Stat callout — shown when slide has a prominent number */}
                    {stat && (
                      <div className="text-[64px] font-bold leading-none tracking-tighter"
                        style={{ color: 'rgba(59,130,246,0.12)' }}>
                        {stat}
                      </div>
                    )}

                    <div className="border-l-2 border-wd-accent/40 pl-4 space-y-3">
                      {slide.text.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="text-base text-white/90 leading-relaxed">
                          <RichText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ACTION — clear directive, decorative symbol */}
              {slide.type === "action" && (
                <div className="space-y-4 w-full relative">
                  {/* Decorative large arrow */}
                  <div className="absolute -bottom-6 right-0 text-[100px] font-bold leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(59,130,246,0.06)' }}>
                    →
                  </div>

                  {slide.title && (
                    <h3 className="text-xl font-bold text-wd-accent">{slide.title}</h3>
                  )}
                  {dailyAction ? (
                    <>
                      <div className="bg-wd-accent/8 border border-wd-accent/20 rounded-xl p-4 space-y-3">
                        <p className="text-base text-white/90 leading-relaxed">
                          <RichText text={dailyAction.text} />
                        </p>
                        {dailyAction.time && (
                          <p className="text-xs text-wd-muted font-mono">⏱ {dailyAction.time}</p>
                        )}
                        {dailyAction.steps.length > 0 && (
                          <div className="border-t border-wd-border/50 pt-3 space-y-1.5">
                            {dailyAction.steps.map((step, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-xs text-wd-accent font-mono mt-0.5 shrink-0">{i + 1}.</span>
                                <p className="text-xs text-white/60 leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {slide.text && (
                        <p className="text-sm text-wd-muted leading-relaxed">{slide.text}</p>
                      )}
                    </>
                  ) : (
                    slide.text.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-base text-white/80 leading-relaxed">{paragraph}</p>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom bar — dots + like in one row, challenge below */}
            <div className="relative z-30 mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {currentCard.slides.map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-300 ${
                        i === slideIdx
                          ? "w-4 h-1.5 bg-wd-accent"
                          : "w-1.5 h-1.5 bg-white/15"
                      }`}
                    />
                  ))}
                </div>

                {/* Like button */}
                <button
                  onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); toggleLike(currentCard.id); }}
                  onClick={(e) => { e.stopPropagation(); toggleLike(currentCard.id); }}
                  className="flex items-center gap-1.5 pointer-events-auto"
                >
                  <span
                    className={`text-xl transition-transform duration-150 ${
                      isLiked ? "scale-125" : "scale-100 opacity-40"
                    }`}
                    style={{ filter: isLiked ? "none" : "grayscale(1)" }}
                  >
                    ❤️
                  </span>
                  {likeCount > 0 && (
                    <span className="text-xs text-wd-muted font-mono">{likeCount}</span>
                  )}
                </button>
              </div>

              {/* Accept Challenge — action slide only */}
              {isActionSlide && (
                challengeStatus === "none" ? (
                  <button
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const action = dailyAction ?? { text: slide.text, steps: [] };
                      handleAcceptChallenge(currentCard.id, action);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const action = dailyAction ?? { text: slide.text, steps: [] };
                      handleAcceptChallenge(currentCard.id, action);
                    }}
                    className="w-full py-3 rounded-xl bg-wd-accent hover:bg-wd-accent-hover text-white font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.97] pointer-events-auto"
                  >
                    Accept Challenge →
                  </button>
                ) : (
                  <div
                    className={`w-full py-3 rounded-xl border font-bold text-sm tracking-wide text-center transition-all duration-500 ${
                      justAcceptedId === currentCard.id
                        ? "bg-green-500/20 border-green-500/40 text-green-400 scale-[1.02]"
                        : "bg-green-500/10 border-green-500/20 text-green-500"
                    }`}
                  >
                    {justAcceptedId === currentCard.id ? "🔥 You're a Doer!" : "✓ Challenge Accepted"}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-wd-muted text-xs mt-2 font-mono opacity-50">
          ↕ swipe ganti card  •  ↔ swipe ganti slide
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pb-2 px-4">
        <div className="w-full max-w-md bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl px-6 py-3 flex justify-around"
          style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.3)" }}>
          <button className="flex flex-col items-center gap-1 text-wd-accent">
            <span className="text-lg">⊞</span>
            <span className="text-[10px] font-mono tracking-widest uppercase">Cards</span>
          </button>
          <button
            onClick={() => router.push("/app/missions")}
            className="flex flex-col items-center gap-1 text-wd-muted hover:text-white transition-all"
          >
            <span className="text-lg">🎯</span>
            <span className="text-[10px] font-mono tracking-widest uppercase">Missions</span>
          </button>
        </div>
      </nav>

      </div>
    </div>
  );
}
