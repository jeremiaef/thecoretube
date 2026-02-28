-- Run this in the Supabase SQL editor (Database → SQL Editor)

create table if not exists user_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id integer not null,
  action_text text not null,
  status text not null default 'accepted',  -- accepted | submitted | approved | rejected
  submitted_report text,
  submitted_photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, card_id)
);

alter table user_challenges enable row level security;

create policy "Users can manage own challenges"
  on user_challenges for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
