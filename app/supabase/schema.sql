-- Enable extension
create extension if not exists pgcrypto;

-- =========================
-- TABLES
-- =========================

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  age int not null check (age >= 16 and age <= 35),
  organization text,
  motivation text not null,
  consent boolean not null default true,
  status text not null default 'new'
    check (status in ('new','reviewing','accepted','rejected')),
  admin_notes text,
  reviewed_at timestamptz,
  reviewer_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_text text not null,
  category text,
  description text not null,
  image_url text not null,
  gallery_images jsonb not null default '[]'::jsonb,
  is_featured boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('project','individual','special')),
  title text not null,
  details jsonb not null default '[]'::jsonb,
  image_url text,
  image_alt text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================
-- ENABLE RLS
-- =========================

alter table public.membership_applications enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;

-- =========================
-- DROP OLD POLICIES (SAFE)
-- =========================

drop policy if exists "public read projects" on public.projects;
drop policy if exists "public read achievements" on public.achievements;
drop policy if exists "public insert applications" on public.membership_applications;
drop policy if exists "admin read applications" on public.membership_applications;
drop policy if exists "admin update applications" on public.membership_applications;
drop policy if exists "admin manage projects" on public.projects;
drop policy if exists "admin manage achievements" on public.achievements;

-- =========================
-- PUBLIC POLICIES
-- =========================

-- Anyone can read projects
create policy "public read projects"
on public.projects
for select
using (true);

-- Anyone can read achievements
create policy "public read achievements"
on public.achievements
for select
using (true);

-- Anyone can insert membership applications
create policy "public insert applications"
on public.membership_applications
for insert
with check (true);

-- =========================
-- ADMIN POLICIES
-- =========================

-- Replace email if needed
-- Current admin: jvishula.work@gmail.com

create policy "admin read applications"
on public.membership_applications
for select
using (auth.email() = 'jvishula.work@gmail.com');

create policy "admin update applications"
on public.membership_applications
for update
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "admin manage projects"
on public.projects
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "admin manage achievements"
on public.achievements
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');