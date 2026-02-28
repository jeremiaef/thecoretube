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
  onComplete: () => void;
  onClose: () => void;
}

export default function DoNowOverlay({ action, cardTitle, onComplete, onClose }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const allChecked = action.steps.length === 0 || checked.size === action.steps.length;

  const handleDone = () => {
    setDone(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-wd-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs font-mono text-wd-muted tracking-widest uppercase">Do it now</p>
          <h1 className="text-xl font-bold text-white mt-0.5">Let's go.</h1>
        </div>
        <button
          onClick={onClose}
          className="text-wd-muted hover:text-white transition text-sm px-3 py-1.5 rounded-full border border-wd-border hover:border-wd-secondary"
        >
          Later
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 overflow-y-auto space-y-5 pb-6">

        {/* Action card */}
        <div className="bg-wd-surface border border-wd-border rounded-2xl p-5 space-y-2"
          style={{ boxShadow: "0 0 40px rgba(59,130,246,0.06)" }}>
          <p className="text-base font-semibold text-white leading-snug">{action.text}</p>
          {action.time && (
            <p className="text-xs text-wd-muted font-mono">⏱ {action.time}</p>
          )}
        </div>

        {/* Steps checklist */}
        {action.steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-mono text-wd-muted tracking-widest uppercase px-1">Langkah-langkah</p>
            {action.steps.map((step, i) => {
              const isChecked = checked.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                    isChecked
                      ? "border-wd-accent/40 bg-wd-accent/8"
                      : "border-wd-border bg-wd-surface hover:border-wd-secondary/50"
                  }`}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                    isChecked ? "border-wd-accent bg-wd-accent" : "border-wd-muted"
                  }`}>
                    {isChecked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-wd-accent font-mono">Step {i + 1}</span>
                    <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                      isChecked ? "text-white/40 line-through" : "text-white/90"
                    }`}>
                      {step}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Progress */}
        {action.steps.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-wd-muted">
              <span>Progress</span>
              <span>{checked.size} / {action.steps.length}</span>
            </div>
            <div className="h-1 bg-wd-border rounded-full overflow-hidden">
              <div
                className="h-full bg-wd-accent rounded-full transition-all duration-500"
                style={{ width: `${(checked.size / action.steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-10 pt-4 border-t border-wd-border">
        {done ? (
          <div className="text-center space-y-1 py-2">
            <p className="text-xl font-bold text-white">🔥 You're a Doer.</p>
            <p className="text-sm text-wd-muted">Not a Watcher. Never was.</p>
          </div>
        ) : (
          <button
            onClick={handleDone}
            disabled={!allChecked}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
              allChecked
                ? "bg-wd-accent hover:bg-wd-accent-hover text-white active:scale-[0.98]"
                : "bg-wd-surface border border-wd-border text-wd-muted cursor-not-allowed"
            }`}
          >
            {allChecked ? "I did it! →" : `Complete all ${action.steps.length} steps first`}
          </button>
        )}
      </div>
    </div>
  );
}
