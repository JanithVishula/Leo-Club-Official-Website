# Leo Club of Pannipitiya Paradise - Web App

Official React + TypeScript website for the Leo Club of Pannipitiya Paradise.

This project is built as a content-driven, animation-rich site where almost all textual content and media references are centralized in `src/config.ts`.

## 1) Project Overview

The app currently includes:

- Home page with animated sections
- Projects page with gallery modal and keyboard navigation
- Board Members page with hierarchy-based card sizing and ordering
- Awards & Achievements page with image placeholders and grouped recognitions
- Join Us page with membership application form
- Admin dashboard page for applications/content management

Core stack:

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3
- GSAP + ScrollTrigger
- Lenis smooth scroll
- React Router
- Lucide icons
- Swiper / Radix UI utilities

## 2) How the Project Is Built

### Build pipeline

`npm run build` executes:

1. `tsc -b` (TypeScript project build/type-check)
2. `vite build` (production bundle)

Vite configuration (`vite.config.ts`):

- `base: './'` for relative asset paths in deployment
- React plugin enabled
- `@` alias maps to `src`

### Runtime flow

1. `src/main.tsx` bootstraps React with `BrowserRouter`
2. `src/App.tsx` initializes Lenis hook + site metadata
3. Router resolves page components
4. Section/page components consume typed content from `src/config.ts`

### Styling and animation

- Tailwind utility classes drive layout and visual style
- Global design tokens are defined in Tailwind config
- GSAP/ScrollTrigger is used for reveal, parallax, stagger, and counter effects
- Lenis synchronizes smooth scrolling with ScrollTrigger updates

## 3) Current Structure

```text
app/
	public/
		projects/...
		*.jpg / *.jpeg (shared static assets)
	src/
		App.tsx
		main.tsx
		config.ts
		routes/
			HomePage.tsx
			ProjectsPage.tsx
			BoardMembersPage.tsx
			AwardsAchievementsPage.tsx
		sections/
			Hero.tsx
			IntroGrid.tsx
			Services.tsx
			WhyChooseMe.tsx
			AchievementsPreview.tsx
			FeaturedProjects.tsx
			Testimonials.tsx
			FAQ.tsx
			Footer.tsx
		hooks/
			useLenis.ts
			use-mobile.ts
		components/ui/
			(Radix/Tailwind reusable UI primitives)
```

## 4) Routing

Defined in `src/App.tsx`:

- `/` -> Home page
- `/projects` -> Projects listing and gallery modal
- `/board-members` -> Leadership cards with hierarchy sizing
- `/awards-achievements` -> Awards and recognitions
- `/join-the-movement` -> Membership application form
- `/admin` -> Single-admin dashboard (applications/projects/achievements)

## 5) Content Configuration (Single Source of Truth)

All page content should be edited in `src/config.ts`.

Main config blocks:

- `siteConfig`
- `heroConfig` (includes navbar links)
- `introGridConfig`
- `featuredProjectsConfig`
- `servicesConfig`
- `whyChooseMeConfig`
- `testimonialsConfig`
- `faqConfig`
- `boardMembersConfig`
- `achievementsConfig`
- `footerConfig`

### Important note

When Supabase is configured, projects and achievements are managed via `/admin` and rendered dynamically. Without Supabase, pages fall back to `config.ts` content.

## 6) Asset Management

- Keep static files in `public/`
- Refer to files with absolute public paths, e.g. `/Onel Herath.jpg`
- Project galleries live in `public/projects/...`
- Awards cards now support image slots via `achievementsConfig.*.image`

## 7) Local Development

### Supabase setup (required for applications + admin)

1. Copy `.env.example` to `.env` and set:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `VITE_ADMIN_EMAIL`
2. Run SQL in `supabase/schema.sql` using Supabase SQL editor.
3. Replace `admin@example.com` inside SQL policies with your real admin email before running.
4. Create that same admin account in Supabase Auth (Email/Password).

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## 8) How to Extend the Project

### Add a new page

1. Create route component in `src/routes/`
2. Add route in `src/App.tsx`
3. Add nav link in `heroConfig.navLinks` if needed
4. Put page data in `src/config.ts`

### Add a new home section

1. Create section in `src/sections/`
2. Import and place it in `src/routes/HomePage.tsx`
3. Add typed data in `src/config.ts`

## 9) Quality and Verification Checklist

Before release:

1. `npm run lint`
2. `npm run build`
3. `npm run preview` and manual route checks:
	 - `/`
	 - `/projects`
	 - `/board-members`
	 - `/awards-achievements`

## 10) Known Build Note

Production builds may show Vite chunk-size warnings (bundle > 500 kB). This is currently a warning, not a build failure.

---

Maintained for the Leo Club of Pannipitiya Paradise website.
