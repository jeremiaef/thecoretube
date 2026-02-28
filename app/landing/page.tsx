"use client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-wd-bg text-white flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          {/* Logo */}
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            we<span className="text-wd-accent">R</span>doers
          </h1>

          {/* Tagline */}
          <p className="text-sm font-semibold text-wd-secondary uppercase tracking-widest mb-6">
            We are Doers, not Watchers
          </p>
          <p className="text-base text-wd-secondary mb-10 leading-relaxed">
            Scroll konten edukasi kayak TikTok.<br />
            Accept challenge. Kumpulkan achievement.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="bg-wd-surface border border-wd-border rounded-2xl p-4">
              <div className="text-2xl mb-2">📖</div>
              <p className="text-xs text-wd-secondary leading-snug">Belajar dalam 60 detik</p>
            </div>
            <div className="bg-wd-surface border border-wd-border rounded-2xl p-4">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-xs text-wd-secondary leading-snug">Accept challenge nyata</p>
            </div>
            <div className="bg-wd-surface border border-wd-border rounded-2xl p-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-xs text-wd-secondary leading-snug">Kumpulkan achievement</p>
            </div>
          </div>

          {/* Categories preview */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["Money", "Career", "Productivity", "Mindset", "Faith"].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs bg-wd-surface border border-wd-border text-wd-secondary"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push("/login")}
            className="w-full py-4 rounded-2xl bg-wd-accent hover:bg-wd-accent-hover text-white font-bold text-base transition-all duration-200 active:scale-[0.98]"
          >
            Mulai jadi Doer — Gratis
          </button>
          <p className="text-wd-muted text-xs mt-3">
            Bukan scrolling biasa. Ini scrolling yang mengubah hidup.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-wd-muted text-xs">
        Built with ❤️ by weRdoers
      </footer>
    </div>
  );
}
