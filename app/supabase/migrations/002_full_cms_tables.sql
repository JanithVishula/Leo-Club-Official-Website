-- =====================================================
-- FULL CMS MIGRATION: All Content to Supabase
-- =====================================================
-- This migration creates tables for all remaining content
-- currently hardcoded in config.ts

-- =========================
-- BOARD MEMBERS TABLE
-- =========================

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

alter table public.board_members enable row level security;

drop policy if exists "public read board_members" on public.board_members;
drop policy if exists "admin manage board_members" on public.board_members;

create policy "public read board_members"
on public.board_members
for select
using (is_active = true);

create policy "admin manage board_members"
on public.board_members
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- TESTIMONIALS TABLE
-- =========================

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

alter table public.testimonials enable row level security;

drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "admin manage testimonials" on public.testimonials;

create policy "public read testimonials"
on public.testimonials
for select
using (is_active = true);

create policy "admin manage testimonials"
on public.testimonials
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- FAQs TABLE
-- =========================

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

drop policy if exists "public read faqs" on public.faqs;
drop policy if exists "admin manage faqs" on public.faqs;

create policy "public read faqs"
on public.faqs
for select
using (is_active = true);

create policy "admin manage faqs"
on public.faqs
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- SERVICES TABLE
-- =========================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_name text,  -- Lucide icon name
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "public read services" on public.services;
drop policy if exists "admin manage services" on public.services;

create policy "public read services"
on public.services
for select
using (is_active = true);

create policy "admin manage services"
on public.services
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- FEATURE CARDS TABLE (Why Choose Us)
-- =========================

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

alter table public.feature_cards enable row level security;

drop policy if exists "public read feature_cards" on public.feature_cards;
drop policy if exists "admin manage feature_cards" on public.feature_cards;

create policy "public read feature_cards"
on public.feature_cards
for select
using (is_active = true);

create policy "admin manage feature_cards"
on public.feature_cards
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- PORTFOLIO IMAGES TABLE (Intro Grid)
-- =========================

create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_alt text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portfolio_images enable row level security;

drop policy if exists "public read portfolio_images" on public.portfolio_images;
drop policy if exists "admin manage portfolio_images" on public.portfolio_images;

create policy "public read portfolio_images"
on public.portfolio_images
for select
using (is_active = true);

create policy "admin manage portfolio_images"
on public.portfolio_images
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- SITE SETTINGS TABLE (Configuration)
-- =========================
-- Flexible key-value store for site-wide settings
-- Used for hero config, footer, metadata, etc.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "admin manage site_settings" on public.site_settings;

create policy "public read site_settings"
on public.site_settings
for select
using (true);

create policy "admin manage site_settings"
on public.site_settings
for all
using (auth.email() = 'jvishula.work@gmail.com')
with check (auth.email() = 'jvishula.work@gmail.com');

-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================

create index if not exists idx_board_members_order on public.board_members(display_order);
create index if not exists idx_testimonials_order on public.testimonials(display_order);
create index if not exists idx_faqs_order on public.faqs(display_order);
create index if not exists idx_services_order on public.services(display_order);
create index if not exists idx_feature_cards_order on public.feature_cards(display_order);
create index if not exists idx_portfolio_images_order on public.portfolio_images(display_order);
create index if not exists idx_projects_order on public.projects(display_order);
create index if not exists idx_achievements_order on public.achievements(display_order);

-- =========================
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
  "description": "Leo Club offers more than just volunteering—it''s a complete leadership development experience that shapes future changemakers.",
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

-- =========================
-- SUCCESS MESSAGE
-- =========================

do $$
begin
  raise notice 'Full CMS tables created successfully! Run data migration script next.';
end $$;
