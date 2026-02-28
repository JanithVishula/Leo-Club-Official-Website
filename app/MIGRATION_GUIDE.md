# Full CMS Migration Guide

## 🎯 Overview

This guide will help you migrate from the hybrid config.ts approach to a **full Supabase CMS approach** where all content is stored in the database.

## 📋 What This Migration Does

**Before:** Content split between `config.ts` (static) + Supabase (some dynamic data)  
**After:** ALL content in Supabase database, `config.ts` only for fallbacks and TypeScript interfaces

### New Tables Created:
- ✅ `board_members` - Board member profiles
- ✅ `testimonials` - User testimonials/reviews
- ✅ `faqs` - Frequently asked questions
- ✅ `services` - Service/focus area cards
- ✅ `feature_cards` - "Why Choose Us" feature cards  
- ✅ `portfolio_images` - Intro grid gallery images
- ✅ `site_settings` - Flexible key-value store for site configuration

## 🚀 Migration Steps

### Step 1: Apply Database Schema

You have **two options** to apply the schema:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy the ENTIRE contents of `app/supabase/schema.sql`
6. Paste into the SQL editor
7. Click **"Run"** 

You should see a success message with all tables created.

#### Option B: Using Supabase CLI (If installed)

```powershell
cd app
supabase db push
```

### Step 2: Verify Tables Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these NEW tables:
   - board_members
   - testimonials
   - faqs
   - services
   - feature_cards
   - portfolio_images
   - site_settings

### Step 3: Run Data Migration Script

This script will populate the tables with data from your current config.ts:

```powershell
cd app
node scripts/migrate-to-full-cms.mjs
```

**Options:**
- `--clear` - Clear existing data before migration (use if re-running)

```powershell
node scripts/migrate-to-full-cms.mjs --clear
```

### Step 4: Verify Data in Database

Check the Supabase Dashboard **Table Editor**:

- `board_members` - Should have 3 members
- `testimonials` - Should have 4 testimonials
- `faqs` - Should have 6 FAQs
- `services` - Should have 6 services
- `feature_cards` - Should have 3 cards
- `portfolio_images` - Should have 6 images
- `site_settings` - Should have ~10 configuration entries

## 🔄 What Changes in Your Code

### API Functions (Already Updated in `cmsApi.ts`):
```typescript
// New functions available:
listBoardMembersPublic()
listTestimonialsPublic()
listFaqsPublic()
listServicesPublic()
listFeatureCardsPublic()
listPortfolioImagesPublic()
getSiteSettingPublic(key)
listAllSiteSettingsPublic()
```

### Components (Next Step - TODO):

Components will be updated to:
1. Fetch data from Supabase using the new API functions
2. Use config.ts only as fallback when Supabase is unavailable
3. Show loading states while data is fetching

**Example transformation:**
```typescript
// BEFORE (config.ts only):
import { testimonialsConfig } from '../config';

export function Testimonials() {
  const testimonials = testimonialsConfig.testimonials;
  // ...
}

// AFTER (Supabase primary, config.ts fallback):
import { listTestimonialsPublic } from '../lib/cmsApi';
import { testimonialsConfig } from '../config';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState(testimonialsConfig.testimonials);
  
  useEffect(() => {
    listTestimonialsPublic().then(data => {
      if (data.length > 0) setTestimonials(data);
    });
  }, []);
  
  // ...
}
```

## ✅ Benefits of Full CMS Approach

### For Admins:
- ✅ Update content without code deployments
- ✅ Add/edit/delete content through admin panel (future)
- ✅ No developer needed for content changes
- ✅ Version control through database

### For Developers:
- ✅ Single source of truth (database)
- ✅ No more config.ts merge conflicts
- ✅ Easier to maintain
- ✅ Consistent data structure
- ✅ Better suited for JAMstack architecture

### For Users:
- ✅ Always up-to-date content
- ✅ Faster deployments (no rebuilds for content)
- ✅ More reliable data consistency

## 🎨 Next Steps After Migration

1. **Update Frontend Components** (see below)
2. **Build Admin Panel UI** for managing content
3. **Remove hardcoded data** from config.ts (keep only interfaces)
4. **Test thoroughly** to ensure all data displays correctly

## 🔧 Component Update Checklist

Components that need updating to use database data:

- [ ] `Testimonials.tsx` - Use `listTestimonialsPublic()`
- [ ] `BoardMembersPage.tsx` - Use `listBoardMembersPublic()`
- [ ] `FAQ.tsx` - Use `listFaqsPublic()`
- [ ] `Services.tsx` - Use `listServicesPublic()`
- [ ] `WhyChooseMe.tsx` - Use `listFeatureCardsPublic()` + `getSiteSettingPublic('why_choose')`
- [ ] `IntroGrid.tsx` - Use `listPortfolioImagesPublic()` + `getSiteSettingPublic('intro_grid')`
- [ ] `Hero.tsx` - Use `getSiteSettingPublic('hero')`
- [ ] `Footer.tsx` - Use `getSiteSettingPublic('footer')`

## 🐛 Troubleshooting

### Migration Script Fails

**Error: Missing Supabase credentials**
- Check `.env.local` has `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**Error: RLS policy error**
- Ensure you applied the schema.sql first (Step 1)
- Check that policies were created correctly in Supabase Dashboard > Authentication > Policies

### Tables Not Showing Up

- Verify you ran the ENTIRE schema.sql file
- Check for SQL errors in Supabase Dashboard > SQL Editor
- Refresh the Table Editor page

### Data Not Appearing

- Check you ran the migration script successfully
- Verify data in Supabase Dashboard > Table Editor
- Check browser console for fetch errors
- Ensure RLS policies allow public SELECT

## 📚 Architecture Overview

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ Fetch via cmsApi.ts
         ▼
┌─────────────────┐
│   Supabase      │
│   PostgreSQL    │
├─────────────────┤
│ - board_members │
│ - testimonials  │
│ - faqs          │
│ - services      │
│ - feature_cards │
│ - portfolio_imgs│
│ - site_settings │
│ - projects ✅   │
│ - achievements ✅│
└─────────────────┘
         │
         │ Images
         ▼
┌─────────────────┐
│ Supabase Storage│
│  /images bucket │
│  - members/     │
│  - projects/    │
│  - achievements/│
└─────────────────┘
```

## 🎉 Success Criteria

Migration is successful when:
- ✅ All 7 new tables exist in Supabase
- ✅ Tables are populated with data
- ✅ Frontend fetches and displays database data
- ✅ No errors in browser console
- ✅ Admin can update content without code changes

---

**Need Help?** Check:
- Supabase Dashboard Logs
- Browser DevTools Console
- Network tab for failed API calls
