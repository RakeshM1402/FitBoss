create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  username text not null,
  age integer not null,
  weight_kg numeric not null,
  height_cm numeric not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'athlete')),
  daily_calorie_goal integer not null,
  body_fat_estimate numeric not null,
  streak_count integer not null default 0,
  last_login_date date,
  primary_goal text not null default 'general_health',
  experience_level text not null default 'beginner',
  workouts_per_week integer not null default 3,
  diet_style text not null default 'balanced',
  training_location text not null default 'Gym',
  discovery_source text not null default 'search',
  motivation text not null default 'Build sustainable fitness habits',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.food_logs (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  food_name text not null,
  grams numeric not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  nutrition_source text,
  logged_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  workout_type text not null,
  duration_seconds integer not null,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fitness_scores (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  points integer not null check (points between -5 and 50),
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leaderboards (
  id uuid primary key default uuid_generate_v4(),
  board_type text not null check (board_type in ('weekly', 'all_time')),
  week_start date,
  user_id uuid not null references public.users(id) on delete cascade,
  score integer not null,
  rank integer not null,
  created_at timestamptz not null default now()
);

create or replace function public.get_weekly_leaderboard()
returns table(rank bigint, username text, fitnessscore bigint)
language sql
as $$
  with week_scores as (
    select
      u.username,
      sum(fs.points) as total_points
    from public.fitness_scores fs
    join public.users u on u.id = fs.user_id
    where fs.date >= date_trunc('week', now())::date
    group by u.username
  )
  select
    row_number() over (order by total_points desc) as rank,
    username,
    total_points::bigint as fitnessscore
  from week_scores
  order by total_points desc;
$$;

create or replace function public.get_all_time_leaderboard()
returns table(rank bigint, username text, fitnessscore bigint)
language sql
as $$
  with all_scores as (
    select
      u.username,
      sum(fs.points) as total_points
    from public.fitness_scores fs
    join public.users u on u.id = fs.user_id
    group by u.username
  )
  select
    row_number() over (order by total_points desc) as rank,
    username,
    total_points::bigint as fitnessscore
  from all_scores
  order by total_points desc;
$$;

alter table public.users enable row level security;
alter table public.food_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.fitness_scores enable row level security;
alter table public.leaderboards enable row level security;

create policy "Users manage own profile" on public.users
  for all using (auth.uid()::text = id::text);

create policy "Users manage own food logs" on public.food_logs
  for all using (auth.uid()::text = user_id::text);

create policy "Users manage own workouts" on public.workouts
  for all using (auth.uid()::text = user_id::text);

create policy "Users manage own scores" on public.fitness_scores
  for all using (auth.uid()::text = user_id::text);

create policy "Leaderboard readable by authenticated users" on public.leaderboards
  for select using (auth.role() = 'authenticated');
