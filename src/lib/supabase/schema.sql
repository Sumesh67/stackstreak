-- StackStreak Database Schema
-- Run this in your Supabase SQL Editor

-- Users profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  avatar_url text,
  streak_shield_count int default 1, -- Pro feature: protect streak once
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Challenge templates
create table public.challenge_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text not null, -- '52week', 'nospend', 'custom', '1k90'
  duration_days int not null,
  target_amount numeric,
  schedule jsonb, -- weekly amounts array for 52-week etc
  icon text,
  is_preset boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User's active challenges
create table public.user_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  template_id uuid references public.challenge_templates(id),
  name text not null,
  type text not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  target_end_at timestamp with time zone,
  target_amount numeric,
  total_saved numeric default 0,
  current_streak int default 0,
  longest_streak int default 0,
  last_checkin_at timestamp with time zone,
  status text default 'active', -- 'active', 'completed', 'abandoned'
  schedule jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Daily check-ins
create table public.checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.user_challenges(id) on delete cascade not null,
  checked_in_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount_saved numeric default 0,
  note text,
  week_number int, -- for 52-week challenge
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI tips log
create table public.ai_tips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.user_challenges(id) on delete cascade,
  tip_text text not null,
  tip_type text, -- 'daily', 'milestone', 'streak_at_risk', 'encouragement'
  shown_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Badges / achievements
create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_type text not null, -- '1week', '1month', 'halfway', 'complete', '100days' etc
  challenge_id uuid references public.user_challenges(id),
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert preset challenges
insert into public.challenge_templates (name, description, type, duration_days, target_amount, icon, is_preset, schedule) values
(
  '52-Week Classic',
  'Save $1 in week 1, $2 in week 2, all the way to $52 in week 52.',
  '52week',
  364,
  1378,
  '🌱',
  true,
  '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]'
),
(
  'No-Spend Month',
  'Track days where you spent nothing on non-essentials. Build the no-spend habit.',
  'nospend',
  30,
  null,
  '🧊',
  true,
  null
),
(
  '$1K in 90 Days',
  'Save $11.11 every day for 90 days. Reach $1,000 in just 3 months.',
  '1k90',
  90,
  1000,
  '🚀',
  true,
  null
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.user_challenges enable row level security;
alter table public.checkins enable row level security;
alter table public.ai_tips enable row level security;
alter table public.user_badges enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can manage own challenges" on public.user_challenges for all using (auth.uid() = user_id);
create policy "Users can manage own checkins" on public.checkins for all using (auth.uid() = user_id);
create policy "Users can view own tips" on public.ai_tips for select using (auth.uid() = user_id);
create policy "Users can view own badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "Challenge templates are public" on public.challenge_templates for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
