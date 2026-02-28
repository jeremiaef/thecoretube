"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

export interface UserProgress {
  streak_count: number;
  last_active_date: string | null;
  last_shared_date: string | null;
  total_cards_read: number;
  read_card_ids: number[];
}

export function useUserProgress(user: User | null) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [hasSharedToday, setHasSharedToday] = useState(false);
  const [readCardIds, setReadCardIds] = useState<number[]>([]);

  const getToday = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;
    initProgress();
  }, [user]);

  const initProgress = async () => {
    if (!user) return;
    const today = getToday();

    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error?.code === "PGRST116") {
      const { data: newData } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          streak_count: 1,
          last_active_date: today,
          total_cards_read: 0,
          read_card_ids: [],
        })
        .select()
        .single();

      if (newData) {
        setProgress(newData);
        setReadCardIds(newData.read_card_ids ?? []);
        setHasSharedToday(false);
      }
      return;
    }

    if (!data) return;

    let newStreak = data.streak_count;
    if (data.last_active_date !== today) {
      if (data.last_active_date) {
        const last = new Date(data.last_active_date);
        const now = new Date(today);
        const diff = Math.round((now.getTime() - last.getTime()) / 86400000);
        newStreak = diff === 1 ? data.streak_count + 1 : 1;
      } else {
        newStreak = 1;
      }
    }

    const { data: updated } = await supabase
      .from("user_progress")
      .update({
        streak_count: newStreak,
        last_active_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updated) {
      setProgress(updated);
      setReadCardIds(updated.read_card_ids ?? []);
      setHasSharedToday(updated.last_shared_date === today);
    }
  };

  const markCardRead = async (cardId: number) => {
    if (!user || readCardIds.includes(cardId)) return;
    const newReadIds = [...readCardIds, cardId];
    setReadCardIds(newReadIds);
    await supabase
      .from("user_progress")
      .update({ read_card_ids: newReadIds })
      .eq("user_id", user.id);
  };

  const markSharedToday = async () => {
    if (!user) return;
    const today = getToday();
    const { data } = await supabase
      .from("user_progress")
      .update({
        last_shared_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) {
      setProgress(data);
      setHasSharedToday(true);
    }
  };

  const incrementCardsRead = async () => {
    if (!user || !progress) return;
    const { data } = await supabase
      .from("user_progress")
      .update({
        total_cards_read: (progress.total_cards_read || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProgress(data);
  };

  return { progress, hasSharedToday, readCardIds, markCardRead, markSharedToday, incrementCardsRead };
}
