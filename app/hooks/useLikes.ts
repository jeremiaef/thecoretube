"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useLikes(userId: string | null, cardIds: number[]) {
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!userId || cardIds.length === 0) return;
    fetchLikes();
  }, [userId, cardIds.length]);

  const fetchLikes = async () => {
    const { data } = await supabase
      .from("card_likes")
      .select("card_id, user_id")
      .in("card_id", cardIds);

    if (!data) return;

    const counts: Record<number, number> = {};
    const liked = new Set<number>();

    for (const row of data) {
      counts[row.card_id] = (counts[row.card_id] || 0) + 1;
      if (row.user_id === userId) liked.add(row.card_id);
    }

    setLikeCounts(counts);
    setLikedCards(liked);
  };

  const toggleLike = useCallback(async (cardId: number) => {
    if (!userId) return;
    const isLiked = likedCards.has(cardId);

    // Optimistic update
    setLikedCards((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(cardId) : next.add(cardId);
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [cardId]: Math.max(0, (prev[cardId] || 0) + (isLiked ? -1 : 1)),
    }));

    if (isLiked) {
      await supabase
        .from("card_likes")
        .delete()
        .eq("card_id", cardId)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("card_likes")
        .insert({ card_id: cardId, user_id: userId });
    }
  }, [userId, likedCards]);

  return { likeCounts, likedCards, toggleLike };
}
