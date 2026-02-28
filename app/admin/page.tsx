"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { Card, Slide } from "../data/cards";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const slideTypeLabel: Record<string, string> = {
  hook: "HOOK",
  insight: "INSIGHT",
  action: "ACTION",
};

type CardDraft = Omit<Card, "id">;

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");
  const [preview, setPreview] = useState<CardDraft | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [publishedCards, setPublishedCards] = useState<Card[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const router = useRouter();

  const fetchCards = async () => {
    const { data } = await supabase
      .from("cards")
      .select("id, category, youtuber, title, slides, image_url")
      .order("id", { ascending: false });
    if (data) setPublishedCards(data as Card[]);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/delete-card", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPublishedCards((prev) => prev.filter((c) => c.id !== id));
    } else {
      const { error } = await res.json();
      alert("Delete failed: " + error);
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const extractImageUrl = (url: string): string => {
    try {
      const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    } catch {}
    return "";
  };

  const PROMPT_TEMPLATE = `Kamu adalah content editor untuk weRdoers, sebuah app behavior change berbasis kartu (seperti TikTok tapi untuk self-improvement).

Saya akan kasih kamu transcript atau ringkasan dari sebuah video YouTube beserta URL videonya. Tugasmu adalah mengubahnya menjadi 5 slides dalam format JSON berikut:

ATURAN:
- slide 1: type "hook" — kalimat pembuka yang bikin penasaran, pakai angka/fakta mengejutkan, emoji di awal, max 3 kalimat. Tidak ada "title".
- slide 2-4: type "insight" — masing-masing 1 insight utama, ada "title" (2-5 kata), dan "text" penjelasannya (2-4 kalimat).
- slide 5: type "action" — title selalu "🎯 Mulai Hari Ini", berisi array "actions" dengan 3 opsi aksi berbeda (dari yang paling gampang ke yang paling impactful, masing-masing 1 kalimat konkret), dan "text" berisi hanya "🎬 Full video → [Nama YouTuber]"
- Semua teks dalam Bahasa Indonesia, casual dan relatable (seperti ngobrol sama teman)
- Pisahkan paragraf dengan \\n\\n

OUTPUT hanya JSON, tidak ada teks lain:

{
  "category": "[Money/Career/Productivity/Mindset/Faith]",
  "youtuber": "[Nama YouTuber]",
  "title": "[Judul video dalam Bahasa Indonesia]",
  "slides": [
    {"type": "hook", "text": "..."},
    {"type": "insight", "title": "...", "text": "..."},
    {"type": "insight", "title": "...", "text": "..."},
    {"type": "insight", "title": "...", "text": "..."},
    {
      "type": "action",
      "title": "🎯 Mulai Hari Ini",
      "actions": [
        {
          "text": "Aksi paling gampang — bisa dilakukan dalam 2 menit.",
          "time": "2 menit",
          "steps": [
            "Langkah pertama yang sangat konkret.",
            "Langkah kedua.",
            "Langkah ketiga — selesai."
          ]
        },
        {
          "text": "Aksi medium — butuh 10-15 menit tapi high impact.",
          "time": "15 menit",
          "steps": [
            "Langkah pertama.",
            "Langkah kedua.",
            "Langkah ketiga."
          ]
        },
        {
          "text": "Aksi yang paling transformatif — butuh komitmen lebih.",
          "time": "30 menit",
          "steps": [
            "Langkah pertama.",
            "Langkah kedua.",
            "Langkah ketiga."
          ]
        }
      ],
      "text": "🎬 Full video → [Nama YouTuber]"
    }
  ]
}

Transcript/ringkasan video: [PASTE DI SINI]`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      if (data.user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      setLoading(false);
      fetchCards();
    });
  }, [router]);

  const handleParse = () => {
    setParseError("");
    setSuccessMsg("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.category || !parsed.youtuber || !parsed.title || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
        setParseError("JSON harus punya: category, youtuber, title, dan slides (array tidak kosong)");
        return;
      }
      if (youtubeUrl.trim() && !parsed.image_url) {
        const extracted = extractImageUrl(youtubeUrl.trim());
        if (extracted) parsed.image_url = extracted;
      }
      setPreview(parsed as CardDraft);
      setCurrentSlide(0);
    } catch {
      setParseError("JSON tidak valid. Cek format dan coba lagi.");
    }
  };

  const handlePublish = async () => {
    if (!preview) return;
    setPublishing(true);
    setParseError("");
    setSuccessMsg("");

    const { data: maxData } = await supabase
      .from("cards")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    const nextId = (maxData?.id ?? 0) + 1;

    const { error } = await supabase.from("cards").insert({
      id: nextId,
      category: preview.category,
      youtuber: preview.youtuber,
      title: preview.title,
      slides: preview.slides,
      ...(preview.image_url ? { image_url: preview.image_url } : {}),
    });

    if (error) {
      setParseError("Gagal publish: " + error.message);
    } else {
      setSuccessMsg(`Card #${nextId} — "${preview.title}" berhasil dipublish!`);
      setJsonInput("");
      setPreview(null);
      setCurrentSlide(0);
      fetchCards();
    }
    setPublishing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wd-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-wd-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const slide = preview ? preview.slides[currentSlide] : null;
  const isActionSlide = slide?.type === "action";

  return (
    <div className="min-h-screen bg-wd-bg text-white">
      {/* Header */}
      <header className="bg-wd-surface/80 backdrop-blur-xl border-b border-wd-border px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">
            we<span className="text-wd-accent">R</span>doers
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-wd-accent/10 text-wd-accent border border-wd-accent/20">
            Admin
          </span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-xs text-wd-secondary hover:text-white transition px-3 py-1 rounded-full border border-wd-border hover:border-wd-secondary"
        >
          ← Back to App
        </button>
      </header>

      {/* Prompt Template */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button
          onClick={() => setShowPrompt((v) => !v)}
          className="flex items-center gap-2 text-sm text-wd-secondary hover:text-white transition"
        >
          <span>{showPrompt ? "▾" : "▸"}</span>
          <span>AI Prompt Template</span>
          <span className="text-xs text-wd-muted">— copy & paste ke Claude/ChatGPT</span>
        </button>

        {showPrompt && (
          <div className="mt-3 relative">
            <pre className="bg-wd-surface border border-wd-border rounded-xl p-4 text-xs text-wd-secondary font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
              {PROMPT_TEMPLATE}
            </pre>
            <button
              onClick={handleCopyPrompt}
              className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-wd-elevated hover:bg-wd-border text-xs text-wd-secondary hover:text-white transition"
            >
              {promptCopied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Paste Card JSON</h2>
            <p className="text-xs text-wd-muted mb-3">
              Generate dari AI chat → copy JSON → paste di sini → preview → publish
            </p>
            <div className="mb-3">
              <label className="text-xs text-wd-secondary mb-1 block">YouTube URL (opsional — auto-generate thumbnail)</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-wd-surface border border-wd-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-wd-muted focus:outline-none focus:border-wd-accent/50 transition"
              />
              {youtubeUrl && extractImageUrl(youtubeUrl) && (
                <p className="text-xs text-green-500 mt-1">✓ Thumbnail terdeteksi</p>
              )}
              {youtubeUrl && !extractImageUrl(youtubeUrl) && (
                <p className="text-xs text-red-500 mt-1">URL tidak valid</p>
              )}
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => { setJsonInput(e.target.value); setParseError(""); setSuccessMsg(""); }}
              placeholder={`{\n  "category": "Money",\n  "youtuber": "Nama YouTuber",\n  "title": "Judul Video",\n  "slides": [\n    { "type": "hook", "text": "..." },\n    { "type": "insight", "title": "...", "text": "..." },\n    {\n      "type": "action",\n      "title": "🎯 Mulai Hari Ini",\n      "actions": [\n        { "text": "Aksi 1", "time": "2 menit", "steps": ["Step 1", "Step 2", "Step 3"] },\n        { "text": "Aksi 2", "time": "15 menit", "steps": ["Step 1", "Step 2", "Step 3"] },\n        { "text": "Aksi 3", "time": "30 menit", "steps": ["Step 1", "Step 2", "Step 3"] }\n      ],\n      "text": "🎬 Full video → Nama YouTuber"\n    }\n  ]\n}`}
              className="w-full h-64 bg-wd-surface border border-wd-border rounded-xl p-4 text-sm font-mono text-white placeholder-wd-muted focus:outline-none focus:border-wd-accent/50 resize-none transition"
            />

            {parseError && (
              <p className="text-red-400 text-xs mt-2">{parseError}</p>
            )}
            {successMsg && (
              <p className="text-green-400 text-xs mt-2">✅ {successMsg}</p>
            )}

            <button
              onClick={handleParse}
              disabled={!jsonInput.trim()}
              className="mt-3 w-full py-2.5 rounded-xl bg-wd-elevated hover:bg-wd-border disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition border border-wd-border"
            >
              Preview Card →
            </button>
          </div>

          {preview && (
            <div className="space-y-3">
              <div className="bg-wd-surface border border-wd-border rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-wd-secondary">Category</span>
                  <span className="text-white">{preview.category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-wd-secondary">YouTuber</span>
                  <span className="text-white">{preview.youtuber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-wd-secondary">Slides</span>
                  <span className="text-white">{preview.slides.length} slides</span>
                </div>
                <div className="text-xs text-wd-secondary">Title</div>
                <div className="text-white text-xs leading-relaxed">{preview.title}</div>
              </div>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-3 rounded-xl bg-wd-accent hover:bg-wd-accent-hover active:scale-[0.98] disabled:opacity-50 font-bold text-sm transition-all"
              >
                {publishing ? "Publishing..." : "Publish ke Supabase 🚀"}
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Live Preview</h2>

          {preview && slide ? (
            <div className="space-y-3">
              <div
                className="bg-wd-surface border border-wd-border p-5 rounded-2xl h-80 flex flex-col justify-between relative overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(59,130,246,0.04)' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
                />

                <div className="relative z-10">
                  <div className="flex gap-1.5 mb-4">
                    {preview.slides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                          i === currentSlide ? "bg-wd-accent" : i < currentSlide ? "bg-wd-accent/40" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-wd-accent/10 text-wd-accent border border-wd-accent/20">
                      {preview.category}
                    </span>
                    <span className="text-xs text-wd-muted">{preview.youtuber}</span>
                  </div>
                  {currentSlide === 0 && (
                    <p className="text-xs text-wd-secondary mb-1">{preview.title}</p>
                  )}
                  <span className={`text-xs font-mono font-semibold tracking-widest ${
                    isActionSlide ? "text-wd-accent" : "text-white/20"
                  }`}>
                    {slideTypeLabel[slide.type]}
                  </span>
                </div>

                <div className="flex-1 flex items-center relative z-10 py-2">
                  <div className="space-y-2 w-full">
                    {slide.title && (
                      <h3 className={`text-base font-bold ${isActionSlide ? "text-wd-accent" : "text-white"}`}>
                        {slide.title}
                      </h3>
                    )}
                    {isActionSlide && slide.actions && slide.actions.length > 0 ? (
                      (() => {
                        const action = slide.actions[0];
                        const normalized = typeof action === "string"
                          ? { text: action, steps: [], time: undefined }
                          : action as { text: string; steps: string[]; time?: string };
                        return (
                          <div className="bg-wd-accent/8 border border-wd-accent/20 rounded-xl p-3 space-y-2">
                            <p className="text-xs text-white/90">{normalized.text}</p>
                            {normalized.time && (
                              <p className="text-[10px] text-wd-muted font-mono">⏱ {normalized.time}</p>
                            )}
                            {normalized.steps.length > 0 && (
                              <div className="border-t border-wd-border/50 pt-2 space-y-1">
                                {normalized.steps.map((step: string, i: number) => (
                                  <div key={i} className="flex items-start gap-1.5">
                                    <span className="text-[10px] text-wd-accent font-mono shrink-0">{i + 1}.</span>
                                    <p className="text-[10px] text-white/60">{step}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      slide.text.split("\n\n").map((p, i) => (
                        <p key={i} className={`text-sm leading-relaxed ${
                          slide.type === "hook" ? "font-semibold text-white" : "text-white/80"
                        }`}>
                          {p}
                        </p>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs text-wd-muted font-mono">
                    {currentSlide + 1} / {preview.slides.length}
                  </span>
                  <div className="flex gap-1">
                    {preview.slides.map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all ${
                          i === currentSlide ? "w-4 h-1.5 bg-wd-accent" : "w-1.5 h-1.5 bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slide navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                  disabled={currentSlide === 0}
                  className="flex-1 py-2 rounded-xl bg-wd-surface border border-wd-border hover:border-wd-secondary disabled:opacity-30 text-sm transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setCurrentSlide((s) => Math.min(preview.slides.length - 1, s + 1))}
                  disabled={currentSlide === preview.slides.length - 1}
                  className="flex-1 py-2 rounded-xl bg-wd-surface border border-wd-border hover:border-wd-secondary disabled:opacity-30 text-sm transition"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div className="h-80 rounded-2xl border border-dashed border-wd-border flex items-center justify-center">
              <p className="text-wd-muted text-sm text-center px-8">
                Preview muncul setelah paste JSON dan klik "Preview Card"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manage Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="border-t border-wd-border pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Manage Cards</h2>
            <span className="text-xs text-wd-muted">{publishedCards.length} cards published</span>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full mb-5 bg-wd-surface border border-wd-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-wd-muted focus:outline-none focus:border-wd-accent/50 transition"
          />

          {(() => {
            const filtered = publishedCards.filter((c) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filtered.length === 0) {
              return <p className="text-wd-muted text-sm text-center py-8">No cards found.</p>;
            }

            // Group by category
            const groups: Record<string, Card[]> = {};
            filtered.forEach((card) => {
              if (!groups[card.category]) groups[card.category] = [];
              groups[card.category].push(card);
            });

            return (
              <div className="space-y-3">
                {Object.entries(groups).map(([category, cards]) => {
                  const isCollapsed = collapsedCategories.has(category);
                  const toggle = () =>
                    setCollapsedCategories((prev) => {
                      const next = new Set(prev);
                      isCollapsed ? next.delete(category) : next.add(category);
                      return next;
                    });

                  return (
                    <div key={category} className="border border-wd-border rounded-xl overflow-hidden">
                      {/* Category header */}
                      <button
                        onClick={toggle}
                        className="w-full flex items-center justify-between px-4 py-3 bg-wd-elevated hover:bg-wd-border transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-wd-accent/10 text-wd-accent border border-wd-accent/20">
                            {category}
                          </span>
                          <span className="text-xs text-wd-muted">{cards.length} cards</span>
                        </div>
                        <span className="text-wd-muted text-xs">{isCollapsed ? "▸" : "▾"}</span>
                      </button>

                      {/* Cards list */}
                      {!isCollapsed && (
                        <div className="divide-y divide-wd-border">
                          {cards.map((card) => (
                            <div
                              key={card.id}
                              className="px-4 py-3 flex items-center justify-between gap-4 bg-wd-surface"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-mono text-wd-muted w-8 shrink-0">#{card.id}</span>
                                <div className="min-w-0">
                                  <p className="text-sm text-white truncate">{card.title}</p>
                                  <p className="text-xs text-wd-muted">{card.youtuber}</p>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {confirmDeleteId === card.id ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-wd-muted">Sure?</span>
                                    <button
                                      onClick={() => handleDelete(card.id)}
                                      disabled={deletingId === card.id}
                                      className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-medium hover:bg-red-500/30 transition disabled:opacity-50"
                                    >
                                      {deletingId === card.id ? "Deleting..." : "Yes, delete"}
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-3 py-1 rounded-lg bg-wd-elevated border border-wd-border text-wd-secondary text-xs hover:text-white transition"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteId(card.id)}
                                    className="px-3 py-1 rounded-lg border border-wd-border text-wd-muted text-xs hover:border-red-500/40 hover:text-red-400 transition"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
