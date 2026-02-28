"use client";
import { useState } from "react";

interface ActionOption {
  text: string;
  steps: string[];
  time?: string;
}

interface Props {
  action: ActionOption;
  cardTitle: string;
  onDoNow: () => void;
  onLater: (when: string) => void;
  onClose: () => void;
}

const laterOptions = [
  { label: "Malam ini", value: "tonight", sub: "Sebelum tidur" },
  { label: "Besok pagi", value: "tomorrow_morning", sub: "Mulai hari dengan baik" },
  { label: "Weekend ini", value: "weekend", sub: "Punya lebih banyak waktu" },
];

export default function ChallengeModal({ action, cardTitle, onDoNow, onLater, onClose }: Props) {
  const [step, setStep] = useState<"choice" | "later_pick" | "later_saved">("choice");
  const [selectedWhen, setSelectedWhen] = useState<string | null>(null);

  const handleLaterConfirm = () => {
    if (!selectedWhen) return;
    onLater(selectedWhen);
    setStep("later_saved");
    setTimeout(onClose, 2200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-wd-surface border border-wd-border rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.4)" }}>

        {step === "choice" && (
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <p className="text-xs font-mono text-wd-muted tracking-widest uppercase">Challenge accepted</p>
              <h2 className="text-2xl font-bold text-white">Welcome, Doer!</h2>
            </div>

            {/* Action preview */}
            <div className="bg-wd-elevated border border-wd-border rounded-xl p-4 space-y-1">
              <p className="text-sm text-white/90 leading-relaxed">{action.text}</p>
              {action.time && (
                <p className="text-xs text-wd-muted font-mono">⏱ {action.time}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={onDoNow}
                className="w-full py-3.5 rounded-xl bg-wd-accent hover:bg-wd-accent-hover text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98]"
              >
                Do it now {action.time ? `· ${action.time}` : "→"}
              </button>
              <button
                onClick={() => setStep("later_pick")}
                className="w-full py-3 rounded-xl border border-wd-border text-wd-secondary text-sm hover:text-white hover:border-wd-secondary transition-all"
              >
                Save for later
              </button>
            </div>
          </div>
        )}

        {step === "later_pick" && (
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <button onClick={() => setStep("choice")} className="text-xs text-wd-muted hover:text-white transition mb-2">← Back</button>
              <h2 className="text-xl font-bold text-white">When will you do this?</h2>
              <p className="text-xs text-wd-muted">Doers who commit to a time are 3x more likely to follow through.</p>
            </div>

            <div className="space-y-2">
              {laterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedWhen(opt.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${
                    selectedWhen === opt.value
                      ? "border-wd-accent bg-wd-accent/10 text-white"
                      : "border-wd-border text-wd-secondary hover:border-wd-secondary hover:text-white"
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-wd-muted mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleLaterConfirm}
              disabled={!selectedWhen}
              className="w-full py-3.5 rounded-xl bg-wd-accent hover:bg-wd-accent-hover disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98]"
            >
              Confirm →
            </button>
          </div>
        )}

        {step === "later_saved" && (
          <div className="p-6 space-y-3 text-center">
            <div className="text-4xl">📌</div>
            <h2 className="text-xl font-bold text-white">Saved to Missions.</h2>
            <p className="text-sm text-wd-muted">Doers deliver. We'll see you there.</p>
          </div>
        )}
      </div>
    </div>
  );
}
