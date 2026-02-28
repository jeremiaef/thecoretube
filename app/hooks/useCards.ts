"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Card } from "../data/cards";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useCards(userId: string | null, readCardIds: number[]) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const readCardIdsRef = { current: readCardIds };

  const fetchCards = async () => {
    if (!userId) return;
    const { data, error } = await supabase.from("cards").select("*");
    if (!error && data) {
      const shuffled = shuffleArray(data as Card[]);
      const unread = shuffled.filter((c) => !readCardIdsRef.current.includes(c.id));
      setCards(unread);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetchCards();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchCards();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [userId]);

  return { cards, loading };
}
