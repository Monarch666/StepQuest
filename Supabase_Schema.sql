-- ============================================================
-- StepQuest — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (project dashboard → SQL)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- USERS table (mirrors auth.users, holds app-specific fields)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.users (
    id           uuid primary key references auth.users(id) on delete cascade,
    username     text unique not null,
    email        text,
    avatar_url   text default '',
    total_steps  bigint default 0,
    total_km     double precision default 0.0,
    created_at   timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
    on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
    on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
    on public.users for insert with check (auth.uid() = id);

-- Anyone can read leaderboard (username + totals only)
create policy "Public leaderboard read"
    on public.users for select using (true);

-- ─────────────────────────────────────────────────────────────
-- JOURNEYS (pre-seeded routes, e.g. "Delhi to Kedarnath")
-- ─────────────────────────────────────────────────────────────
create table if not exists public.journeys (
    id           uuid primary key default uuid_generate_v4(),
    title        text not null,
    description  text default '',
    total_km     double precision not null,
    difficulty   text check (difficulty in ('Easy', 'Moderate', 'Hard')) default 'Moderate',
    banner_url   text default '',
    created_at   timestamptz default now()
);

alter table public.journeys enable row level security;

create policy "Anyone can read journeys"
    on public.journeys for select using (true);

-- ─────────────────────────────────────────────────────────────
-- MILESTONES (waypoints within a journey)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.milestones (
    id          uuid primary key default uuid_generate_v4(),
    journey_id  uuid not null references public.journeys(id) on delete cascade,
    name        text not null,
    description text default '',
    km_mark     double precision not null,
    created_at  timestamptz default now()
);

alter table public.milestones enable row level security;

create policy "Anyone can read milestones"
    on public.milestones for select using (true);

-- ─────────────────────────────────────────────────────────────
-- USER_JOURNEYS (tracks a user's active / completed journeys)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_journeys (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null references public.users(id) on delete cascade,
    journey_id      uuid not null references public.journeys(id) on delete cascade,
    progress_km     double precision default 0.0,
    is_completed    boolean default false,
    started_at      timestamptz default now(),
    completed_at    timestamptz,
    unique (user_id, journey_id)
);

alter table public.user_journeys enable row level security;

create policy "Users manage own journey progress"
    on public.user_journeys for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- DAILY_LOGS (one row per user per calendar day)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.daily_logs (
    id       uuid primary key default uuid_generate_v4(),
    user_id  uuid not null references public.users(id) on delete cascade,
    date     date not null,
    steps    int default 0,
    km       double precision default 0.0,
    unique (user_id, date)
);

alter table public.daily_logs enable row level security;

create policy "Users manage own daily logs"
    on public.daily_logs for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- ACHIEVEMENTS (badges earned when a milestone is passed)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.achievements (
    id           uuid primary key default uuid_generate_v4(),
    user_id      uuid not null references public.users(id) on delete cascade,
    milestone_id uuid not null references public.milestones(id) on delete cascade,
    earned_at    timestamptz default now(),
    unique (user_id, milestone_id)
);

alter table public.achievements enable row level security;

create policy "Users manage own achievements"
    on public.achievements for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKET — user avatars
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Anyone can read avatars"
    on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────────
-- SEED DATA — sample journeys
-- ─────────────────────────────────────────────────────────────
insert into public.journeys (title, description, total_km, difficulty) values
    ('Delhi to Kedarnath',    'A spiritual trek through the Himalayas via Haridwar, Rishikesh, and the Char Dham route.', 464, 'Hard'),
    ('Mumbai to Goa',         'A scenic coastal walk along the Konkan coastline through beaches and fishing villages.', 590, 'Moderate'),
    ('Manali to Leh',         'The legendary Himalayan highway through Rohtang Pass and the Zanskar Valley.', 479, 'Hard'),
    ('Jaipur to Agra',        'A heritage trail through Rajasthan and the historic Golden Triangle.',                     232, 'Easy'),
    ('Chennai to Pondicherry','A peaceful coastal route with temples, backwaters, and French colonial architecture.',     150, 'Easy')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- LEADERBOARD VIEW (helper for app queries)
-- ─────────────────────────────────────────────────────────────
create or replace view public.leaderboard_weekly as
select
    u.id          as user_id,
    u.username,
    u.avatar_url,
    coalesce(sum(d.km), 0)::double precision as total_km
from public.users u
left join public.daily_logs d
    on d.user_id = u.id
    and d.date >= date_trunc('week', now())
group by u.id, u.username, u.avatar_url
order by total_km desc;
