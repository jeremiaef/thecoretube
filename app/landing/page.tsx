"use client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          {/* Logo */}
          <h1 className="text-5xl font-bold mb-4">
            Core<span className="text-cyan-400">Tube</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-2">
            Pengganti doomscrolling-mu jadi microlearning.
          </p>
          <p className="text-gray-500 mb-8">
            Swipe kayak TikTok — rangkuman video edukasi 30+ menit dari YouTube terbaik.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm text-gray-400">Paham dalam 60 detik</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-gray-400">Topik yang kamu butuhkan</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-sm text-gray-400">Swipe kayak TikTok</p>
            </div>
          </div>

          {/* Categories preview */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["Money", "Career", "Productivity", "Mindset", "Faith"].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <button
            onClick={() => router.push("/login")}
            className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg transition mb-3"
          >
            Mulai Belajar — Gratis
          </button>
          <p className="text-gray-600 text-xs">
            Ubah doomscrolling jadi productive learning
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-700 text-xs">
        Built with ❤️ by CoreVision
      </footer>
    </div>
  );
}