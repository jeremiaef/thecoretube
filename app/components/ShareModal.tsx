"use client";
import { Card } from "../data/cards";

interface ShareModalProps {
  card: Card;
  onConfirm: () => void;
}

export default function ShareModal({ card, onConfirm }: ShareModalProps) {
  const hook = card.slides[0];
  const previewText = hook.text.replace(/\n\n/g, " ").substring(0, 120) + "...";

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-wd-surface rounded-t-3xl border-t border-wd-border p-6 w-full max-w-md">
        {/* Handle bar */}
        <div className="w-10 h-0.5 bg-wd-border rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">📲</div>
          <h2 className="text-white font-bold text-lg">Share ke Story-mu!</h2>
          <p className="text-wd-secondary text-sm mt-1">
            1 story per hari = scroll sepuasnya hari ini
          </p>
        </div>

        {/* Card preview */}
        <div className="bg-wd-bg rounded-2xl p-5 mb-5 border border-wd-border relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest text-wd-accent">weRdoers</span>
            <span className="text-wd-muted text-xs">•</span>
            <span className="text-wd-secondary text-xs">{card.category}</span>
          </div>
          <p className="text-white text-sm leading-relaxed">{previewText}</p>
          <p className="text-wd-muted text-xs mt-3">— {card.youtuber}</p>
        </div>

        {/* Steps */}
        <div className="flex justify-around text-center mb-6">
          {["Screenshot card", "Post ke Story", "Konfirmasi"].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-wd-accent/10 text-wd-accent text-xs font-bold flex items-center justify-center border border-wd-accent/25">
                {i + 1}
              </div>
              <p className="text-wd-secondary text-xs">{step}</p>
            </div>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl bg-wd-accent hover:bg-wd-accent-hover active:scale-[0.98] text-white font-bold text-base transition-all duration-200"
        >
          Udah Share! Lanjut Belajar 🚀
        </button>

        <p className="text-center text-wd-muted text-xs mt-3">
          Berbagi ilmu = kebaikan yang mengalir 🤝
        </p>
      </div>
    </div>
  );
}
