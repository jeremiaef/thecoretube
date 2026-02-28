"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const categoryTracks: Record<string, string> = {
  All:          "/sounds/productivity.mp3",
  Money:        "/sounds/money.mp3",
  Career:       "/sounds/career.mp3",
  Productivity: "/sounds/productivity.mp3",
  Mindset:      "/sounds/mindset.mp3",
  Faith:        "/sounds/faith.mp3",
};

const TARGET_VOLUME = 0.15;

export function useAudio(category: string) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);

  // Call on first user interaction to satisfy browser autoplay policy
  const startAudio = useCallback(() => {
    if (started) return;
    setStarted(true);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const src = categoryTracks[category] || categoryTracks["All"];
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audio.muted = mutedRef.current;

    let fadeInTimer: ReturnType<typeof setInterval>;

    audio.play().then(() => {
      fadeInTimer = setInterval(() => {
        if (audio.volume < TARGET_VOLUME - 0.01) {
          audio.volume = Math.min(TARGET_VOLUME, audio.volume + 0.01);
        } else {
          audio.volume = TARGET_VOLUME;
          clearInterval(fadeInTimer);
        }
      }, 30);
    }).catch(() => {});

    // Fade out previous track
    const prev = audioRef.current;
    if (prev) {
      const fadeOutTimer = setInterval(() => {
        if (prev.volume > 0.02) {
          prev.volume = Math.max(0, prev.volume - 0.02);
        } else {
          prev.pause();
          prev.src = "";
          clearInterval(fadeOutTimer);
        }
      }, 30);
    }

    audioRef.current = audio;

    return () => {
      clearInterval(fadeInTimer);
      audio.pause();
      audio.src = "";
    };
  }, [category, started]);

  useEffect(() => {
    mutedRef.current = muted;
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMute = () => setMuted((m) => !m);

  return { muted, toggleMute, startAudio, started };
}
