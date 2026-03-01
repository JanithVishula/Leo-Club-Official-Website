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
  project_id text,
  completion_date date,
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

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image_url text,
  bio text,
  email text,
  linkedin text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image_url text,
  quote text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_name text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null,
  image_alt text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_alt text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_featured_projects (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  display_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_featured_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  display_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- ENABLE RLS
-- =========================

alter table public.membership_applications enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.board_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.services enable row level security;
alter table public.feature_cards enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_featured_projects enable row level security;
alter table public.homepage_featured_achievements enable row level security;

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
drop policy if exists "public read board_members" on public.board_members;
drop policy if exists "admin manage board_members" on public.board_members;
drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "admin manage testimonials" on public.testimonials;
drop policy if exists "public read faqs" on public.faqs;
drop policy if exists "admin manage faqs" on public.faqs;
drop policy if exists "public read services" on public.services;
drop policy if exists "admin manage services" on public.services;
drop policy if exists "public read feature_cards" on public.feature_cards;
drop policy if exists "admin manage feature_cards" on public.feature_cards;
drop policy if exists "public read portfolio_images" on public.portfolio_images;
drop policy if exists "admin manage portfolio_images" on public.portfolio_images;
drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "admin manage site_settings" on public.site_settings;
drop policy if exists "public read homepage_featured_projects" on public.homepage_featured_projects;
drop policy if exists "public read homepage_featured_achievements" on public.homepage_featured_achievements;
drop policy if exists "admin manage homepage_featured_achievements" on public.homepage_featured_achievements;
drop policy if exists "admin manage homepage_featured_projects" on public.homepage_featured_projects;

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

create policy "public read board_members"
on public.board_members
for select
using (is_active = true);

create policy "admin manage board_members"
on public.board_members
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read testimonials"
on public.testimonials
for select
using (is_active = true);

create policy "admin manage testimonials"
on public.testimonials
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read faqs"
on public.faqs
for select
using (is_active = true);

create policy "admin manage faqs"
on public.faqs
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read services"
on public.services
for select
using (is_active = true);

create policy "admin manage services"
on public.services
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read feature_cards"
on public.feature_cards
for select
using (is_active = true);

create policy "admin manage feature_cards"
on public.feature_cards
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read portfolio_images"
on public.portfolio_images
for select
using (is_active = true);

create policy "admin manage portfolio_images"
on public.portfolio_images
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read site_settings"
on public.site_settings
for select
using (true);

create policy "admin manage site_settings"
on public.site_settings
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read homepage_featured_projects"
on public.homepage_featured_projects
for select
using (true);

create policy "admin manage homepage_featured_projects"
on public.homepage_featured_projects
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

create policy "public read homepage_featured_achievements"
on public.homepage_featured_achievements
for select
using (true);

create policy "admin manage homepage_featured_achievements"
on public.homepage_featured_achievements
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

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
-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================

create index if not exists idx_board_members_order on public.board_members(display_order);
create index if not exists idx_testimonials_order on public.testimonials(display_order);
create index if not exists idx_faqs_order on public.faqs(display_order);
create unique index if not exists idx_homepage_featured_unique_achievement on public.homepage_featured_achievements(achievement_id);
create index if not exists idx_homepage_featured_achievements_order on public.homepage_featured_achievements(display_order);
create index if not exists idx_services_order on public.services(display_order);
create index if not exists idx_feature_cards_order on public.feature_cards(display_order);
create index if not exists idx_portfolio_images_order on public.portfolio_images(display_order);
create index if not exists idx_projects_order on public.projects(display_order);
create index if not exists idx_achievements_order on public.achievements(display_order);
create index if not exists idx_board_members_active on public.board_members(is_active);
create index if not exists idx_testimonials_active on public.testimonials(is_active);
create index if not exists idx_faqs_active on public.faqs(is_active);
create index if not exists idx_services_active on public.services(is_active);
create index if not exists idx_projects_project_id on public.projects(project_id);
create index if not exists idx_projects_completion_date on public.projects(completion_date desc);
create index if not exists idx_homepage_featured_unique_project on public.homepage_featured_projects(project_id);
create index if not exists idx_homepage_featured_order on public.homepage_featured_projects(display_order);

-- =========================
-- DATABASE FUNCTIONS
-- =========================

-- Function to generate project IDs in format YYYYMMDD-XXX
create or replace function generate_project_id(p_completion_date date)
returns text as $$
declare
  date_prefix text;
  next_sequence int;
  result_id text;
begin
  if p_completion_date is null then
    return null;
  end if;
  
  -- Format date as YYYYMMDD
  date_prefix := to_char(p_completion_date, 'YYYYMMDD');
  
  -- Find the highest sequence number for this date
  select coalesce(
    max(
      cast(
        substring(project_id from '\d{8}-(\d{3})') as int
      )
    ), 0
  ) + 1
  into next_sequence
  from public.projects
  where project_id like date_prefix || '-%';
  
  -- Format sequence as 3-digit number
  result_id := date_prefix || '-' || lpad(next_sequence::text, 3, '0');
  
  return result_id;
end;
$$ language plpgsql;

-- Function to auto-generate project_id on insert
create or replace function auto_generate_project_id()
returns trigger as $$
begin
  if new.completion_date is not null and (new.project_id is null or new.project_id = '') then
    new.project_id := generate_project_id(new.completion_date);
  end if;
  return new;
end;
$$ language plpgsql;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================
-- DATABASE TRIGGERS
-- =========================

-- Trigger to update homepage_featured_achievements updated_at
drop trigger if exists update_homepage_featured_achievements_updated_at on public.homepage_featured_achievements;
create trigger update_homepage_featured_achievements_updated_at
  before update on public.homepage_featured_achievements
  for each row
  execute function update_updated_at_column();

-- Trigger to auto-generate project_id
drop trigger if exists trigger_auto_generate_project_id on public.projects;
create trigger trigger_auto_generate_project_id
  before insert on public.projects
  for each row
  execute function auto_generate_project_id();

-- Trigger to update homepage_featured_projects updated_at
drop trigger if exists update_homepage_featured_projects_updated_at on public.homepage_featured_projects;
create trigger update_homepage_featured_projects_updated_at
  before update on public.homepage_featured_projects
  for each row
  execute function update_updated_at_column();

-- =========================
-- TABLE/COLUMN DOCUMENTATION
-- =========================

comment on column public.projects.project_id is 'Auto-generated project ID in format YYYYMMDD-XXX';
comment on column public.projects.completion_date is 'Project completion date used for ID generation and sorting';
comment on column public.projects.date_text is 'Formatted date text for display (e.g., "March 2026")';
comment on table public.homepage_featured_projects is 'Stores up to 5 projects featured on homepage with custom ordering';
comment on table public.homepage_featured_achievements is 'Stores up to 3 achievements featured on homepage with custom ordering';

-- ===========================
-- DEFAULT SITE SETTINGS
-- =========================

insert into public.site_settings (key, value, description) values
('site_info', '{
  "name": "Leo Club of Pannipitiya Paradise",
  "tagline": "Empowering Youth, Building Communities",
  "email": "leoclub.pannipitiya@gmail.com",
  "phone": "+94 76 123 4567",
  "address": "Pannipitiya, Sri Lanka"
}'::jsonb, 'General site information'),

('hero', '{
  "title": "Empowering Youth,",
  "titleItalic": "Building Communities",
  "description": "Leo Club of Pannipitiya Paradise is a dynamic youth organization dedicated to community service, leadership development, and creating positive change. Join us in making a difference.",
  "primaryCta": "Join Our Movement",
  "secondaryCta": "Explore Projects",
  "backgroundImage": "/hero-background.jpg",
  "backgroundImageAlt": "Leo Club members volunteering"
}'::jsonb, 'Hero section configuration'),

('intro_grid', '{
  "subtitle": "Who We Are",
  "titleRegular": "Leading Change Through",
  "titleItalic": "Service & Leadership",
  "description": "We are young leaders passionate about making a difference in our community. Through impactful projects, skill development, and meaningful connections, Leo Club of Pannipitiya Paradise creates opportunities for growth and positive change."
}'::jsonb, 'Intro grid section text'),

('featured_projects', '{
  "subtitle": "Recent Work",
  "titleRegular": "Projects Making a",
  "titleItalic": "Real Impact"
}'::jsonb, 'Featured projects section headings'),

('services', '{
  "subtitle": "What We Do",
  "titleRegular": "Our Focus",
  "titleItalic": "Areas"
}'::jsonb, 'Services section headings'),

('why_choose', '{
  "subtitle": "Why Join Us",
  "titleRegular": "Transform Your Life Through",
  "titleItalic": "Leadership & Service",
  "description": "Leo Club offers more than just volunteering—it is a complete leadership development experience that shapes future changemakers.",
  "wideTitle": "Be Part of Something Greater",
  "wideDescription": "Join a global network of young leaders committed to making a difference. Develop skills, create impact, and build lifelong friendships.",
  "wideImage": "/wide-banner.jpg",
  "wideImageAlt": "Leo Club community gathering"
}'::jsonb, 'Why choose us section configuration'),

('testimonials', '{
  "subtitle": "Member Stories",
  "titleRegular": "Voices from Our",
  "titleItalic": "Community"
}'::jsonb, 'Testimonials section headings'),

('faq', '{
  "subtitle": "Common Questions",
  "titleRegular": "Frequently Asked",
  "titleItalic": "Questions",
  "ctaText": "Still have questions?",
  "ctaButtonText": "Contact Us",
  "ctaHref": "#footer"
}'::jsonb, 'FAQ section configuration'),

('board_members', '{
  "subtitle": "Leadership Team",
  "title": "Meet Our Board",
  "description": "Our dedicated board members lead with passion and commitment, driving the vision of Leo Club of Pannipitiya Paradise forward."
}'::jsonb, 'Board members page headings'),

('achievements', '{
  "subtitle": "Recognition & Excellence",
  "title": "Awards and Achievements",
  "specialRecognition": "Mid Year Review - District 306C2: Most Popular Community Based Leo Club of District 306C2"
}'::jsonb, 'Achievements page configuration'),

('footer', '{
  "description": "Leo Club of Pannipitiya Paradise is dedicated to developing leadership skills and creating positive change through community service.",
  "copyright": "Leo Club of Pannipitiya Paradise. All rights reserved.",
  "socialLinks": [
    {"iconName": "Facebook", "href": "https://facebook.com/leopannipitiya", "label": "Facebook"},
    {"iconName": "Instagram", "href": "https://instagram.com/leopannipitiya", "label": "Instagram"},
    {"iconName": "Linkedin", "href": "https://linkedin.com/company/leopannipitiya", "label": "LinkedIn"}
  ]
}'::jsonb, 'Footer configuration')

on conflict (key) do nothing;