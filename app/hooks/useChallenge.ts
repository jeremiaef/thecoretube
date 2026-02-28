"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type ChallengeStatus = "none" | "accepted" | "submitted" | "approved" | "rejected";

interface Challenge {
  id: string;
  card_id: number;
  action_text: string;
  status: ChallengeStatus;
}

export function useChallenge(userId: string | null, cardIds: number[]) {
  const [challenges, setChallenges] = useState<Record<number, Challenge>>({});

  useEffect(() => {
    if (!userId || cardIds.length === 0) return;

    const fetchChallenges = async () => {
      const { data } = await supabase
        .from("user_challenges")
        .select("id, card_id, action_text, status")
        .eq("user_id", userId)
        .in("card_id", cardIds);

      if (data) {
        const map: Record<number, Challenge> = {};
        data.forEach((c) => { map[c.card_id] = c; });
        setChallenges(map);
      }
    };

    fetchChallenges();
  }, [userId, cardIds.length]);

  const acceptChallenge = useCallback(async (cardId: number, actionText: string) => {
    if (!userId) return;

    // Optimistic update
    setChallenges((prev) => ({
      ...prev,
      [cardId]: { id: "optimistic", card_id: cardId, action_text: actionText, status: "accepted" },
    }));

    const { data } = await supabase
      .from("user_challenges")
      .upsert(
        {
          user_id: userId,
          card_id: cardId,
          action_text: actionText,
          status: "accepted",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,card_id" }
      )
      .select("id, card_id, action_text, status")
      .single();

    if (data) {
      setChallenges((prev) => ({ ...prev, [cardId]: data }));
    }
  }, [userId]);

  const getStatus = (cardId: number): ChallengeStatus => {
    return (challenges[cardId]?.status as ChallengeStatus) ?? "none";
  };

  return { acceptChallenge, getStatus };
}
