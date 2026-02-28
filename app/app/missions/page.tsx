"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface Mission {
  id: string;
  card_id: number;
  action_text: string;
  status: "accepted" | "submitted" | "approved" | "rejected";
  updated_at: string;
  card?: { title: string; category: string; youtuber: string };
}

const statusLabel: Record<string, { label: string; color: string }> = {
  accepted:  { label: "Active",    color: "text-wd-accent border-wd-accent/30 bg-wd-accent/10" },
  submitted: { label: "Submitted", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  approved:  { label: "Done",      color: "text-green-400 border-green-500/30 bg-green-500/10" },
  rejected:  { label: "Redo",      color: "text-red-400 border-red-400/30 bg-red-400/10" },
};

export default function MissionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/"); return; }
      setUser(data.user);
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchMissions = async () => {
      const { data: challenges } = await supabase
        .from("user_challenges")
        .select("id, card_id, action_text, status, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (!challenges || challenges.length === 0) { setLoading(false); return; }

      const cardIds = [...new Set(challenges.map((c) => c.card_id))];
      const { data: cards } = await supabase
        .from("cards")
        .select("id, title, category, youtuber")
        .in("id", cardIds);

      const cardMap = Object.fromEntries((cards ?? []).map((c) => [c.id, c]));
      setMissions(challenges.map((c) => ({ ...c, card: cardMap[c.card_id] })));
      setLoading(false);
    };

    fetchMissions();
  }, [user]);

  const active = missions.filter((m) => m.status === "accepted" || m.status === "rejected");
  const completed = missions.filter((m) => m.status === "submitted" || m.status === "approved");

  return (
    <div className="grid-bg min-h-screen text-white flex justify-center">
      <div className="w-full max-w-md flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-50 px-3 pt-3 pb-2">
          <div className="rounded-2xl bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#2A2A2A] px-4 py-2.5 flex justify-between items-center"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
            <span className="text-sm font-bold tracking-tight text-white">
              MISSIONS <span className="text-wd-muted font-normal text-xs">beta</span>
            </span>
            <button
              onClick={() => router.push("/app")}
              className="text-xs text-wd-muted hover:text-white transition px-3 py-1 rounded-full border border-[#2A2A2A] hover:border-wd-secondary"
            >
              ← Cards
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-24 pt-2">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-wd-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : missions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center gap-3 px-8">
              <p className="text-4xl">🎯</p>
              <p className="text-white font-bold">No missions yet.</p>
              <p className="text-wd-muted text-sm leading-relaxed">
                Accept a challenge from the cards to start your first mission.
              </p>
              <button
                onClick={() => router.push("/app")}
                className="mt-2 px-5 py-2 rounded-full bg-wd-accent text-white text-sm font-bold hover:bg-wd-accent-hover transition"
              >
                Go to Cards →
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-2">

              {/* Active */}
              {active.length > 0 && (
                <section className="space-y-2">
                  <p className="text-xs font-mono text-wd-muted tracking-widest uppercase px-1">
                    Active · {active.length}
                  </p>
                  {active.map((m) => (
                    <MissionCard key={m.id} mission={m} />
                  ))}
                </section>
              )}

              {/* Completed */}
              {completed.length > 0 && (
                <section className="space-y-2">
                  <p className="text-xs font-mono text-wd-muted tracking-widest uppercase px-1">
                    Completed · {completed.length}
                  </p>
                  {completed.map((m) => (
                    <MissionCard key={m.id} mission={m} muted />
                  ))}
                </section>
              )}
            </div>
          )}
        </main>

        {/* Bottom nav */}
        <BottomNav active="missions" />
      </div>
    </div>
  );
}

function MissionCard({ mission, muted = false }: { mission: Mission; muted?: boolean }) {
  const status = statusLabel[mission.status] ?? statusLabel.accepted;
  const date = new Date(mission.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  return (
    <div className={`bg-wd-surface border border-wd-border rounded-2xl p-4 space-y-3 transition-opacity ${muted ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          {mission.card && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-wd-accent/10 text-wd-accent border border-wd-accent/20">
                {mission.card.category}
              </span>
              <span className="text-xs text-wd-muted">{date}</span>
            </div>
          )}
          <p className="text-sm text-white/90 leading-relaxed">{mission.action_text}</p>
          {mission.card && (
            <p className="text-xs text-wd-muted">{mission.card.youtuber}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {mission.status === "accepted" && (
        <button className="w-full py-2.5 rounded-xl bg-wd-accent hover:bg-wd-accent-hover text-white text-sm font-bold transition-all active:scale-[0.98]">
          Start now →
        </button>
      )}
    </div>
  );
}

function BottomNav({ active }: { active: "cards" | "missions" }) {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pb-2 px-4">
      <div className="w-full max-w-md bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl px-6 py-3 flex justify-around"
        style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.3)" }}>
        <button
          onClick={() => router.push("/app")}
          className={`flex flex-col items-center gap-1 transition-all ${active === "cards" ? "text-wd-accent" : "text-wd-muted hover:text-white"}`}
        >
          <span className="text-lg">⊞</span>
          <span className="text-[10px] font-mono tracking-widest uppercase">Cards</span>
        </button>
        <button
          onClick={() => router.push("/app/missions")}
          className={`flex flex-col items-center gap-1 transition-all ${active === "missions" ? "text-wd-accent" : "text-wd-muted hover:text-white"}`}
        >
          <span className="text-lg">🎯</span>
          <span className="text-[10px] font-mono tracking-widest uppercase">Missions</span>
        </button>
      </div>
    </nav>
  );
}
