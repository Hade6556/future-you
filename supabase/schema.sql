-- Future You: Supabase Schema
-- Run this in the Supabase SQL editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  user_name text,
  archetype text,
  ambition_type text,
  is_premium boolean default false,
  trial_started_at timestamptz,
  streak integer default 0,
  last_completed_date date,
  created_at timestamptz default now()
);

-- Plans table
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  goal text not null,
  pipeline_output jsonb,
  intake_response jsonb,
  created_at timestamptz default now()
);

-- Reflections table (daily brief completions + coaching responses)
create table if not exists public.reflections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null default current_date,
  content text,
  coach_response text,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  created_at timestamptz default now()
);

-- Events table (bookmarked/saved events)
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  event_data jsonb not null,
  bookmarked boolean default true,
  added_to_plan boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.plans enable row level security;
alter table public.reflections enable row level security;
alter table public.events enable row level security;

-- RLS Policies: users can only see/modify their own data
create policy "users: own row" on public.users for all using (auth.uid() = id);
create policy "plans: own rows" on public.plans for all using (auth.uid() = user_id);
create policy "reflections: own rows" on public.reflections for all using (auth.uid() = user_id);
create policy "events: own rows" on public.events for all using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Google Calendar OAuth columns (run this after initial setup if schema already exists)
alter table public.users
  add column if not exists google_calendar_token jsonb,
  add column if not exists google_calendar_id text;

-- Stripe customer ID (run this after initial setup if schema already exists)
alter table public.users
  add column if not exists stripe_customer_id text unique;
