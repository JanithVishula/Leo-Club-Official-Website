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
-- =========================
-- STORAGE BUCKET SETUP
-- =========================

-- Create public images bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,  -- Public bucket for easy access
  5242880,  -- 5MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- =========================
-- STORAGE POLICIES
-- =========================

-- Drop existing storage policies if any
drop policy if exists "Public can view images" on storage.objects;
drop policy if exists "Admin can upload images" on storage.objects;
drop policy if exists "Admin can update images" on storage.objects;
drop policy if exists "Admin can delete images" on storage.objects;

-- Anyone can view/download images (public bucket)
create policy "Public can view images"
on storage.objects for select
using (bucket_id = 'images');

-- Only admin can upload images
create policy "Admin can upload images"
on storage.objects for insert
with check (
  bucket_id = 'images' 
  and (
    -- Allow authenticated admin
    (auth.role() = 'authenticated' and auth.email() = 'jvishula.work@gmail.com')
    or
    -- Allow service_role for migrations (bypasses RLS anyway, but explicit is better)
    auth.role() = 'service_role'
  )
);

-- Only admin can update images
create policy "Admin can update images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'images'
  and auth.email() = 'jvishula.work@gmail.com'
)
with check (
  bucket_id = 'images'
  and auth.email() = 'jvishula.work@gmail.com'
);

-- Only admin can delete images
create policy "Admin can delete images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'images'
  and auth.email() = 'jvishula.work@gmail.com'
);
