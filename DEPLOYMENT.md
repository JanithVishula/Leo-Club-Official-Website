# 🚀 Leo Club Website - Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ Before You Start:
- [x] Git repository initialized
- [x] .gitignore configured
- [x] .env file exists (in app/)
- [x] .env is NOT tracked by git
- [x] Supabase database schema applied
- [ ] Run cleanup script
- [ ] Test build locally
- [ ] Code pushed to GitHub

---

## 🧹 **Step 1: Run Cleanup Script**

```powershell
# Navigate to project root
cd "C:\Users\Admin\OneDrive\Desktop\Leo Club Official Website"

# Run cleanup script
.\cleanup.ps1
```

**What it does:**
- ✅ Removes duplicate SQL files
- ✅ Deletes build artifacts (dist/)
- ✅ Verifies .env security
- ✅ Checks git status

---

## 🔨 **Step 2: Test Local Build**

```powershell
# Navigate to app directory
cd app

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Test the build locally
npm run preview
```

**Expected output:**
```
✓ built in 2.5s
  
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

**Test in browser:**
- Visit http://localhost:4173
- Test admin login
- Test image uploads
- Verify all pages work

---

## 🔐 **Step 3: Verify Environment Variables**

Your `.env` file should contain:
```env
VITE_SUPABASE_URL=https://cyffuhudigwapmkffqes.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_EMAIL=jvishula.work@gmail.com
```

**⚠️ IMPORTANT:** These values will be added to Vercel Dashboard, NOT committed to git!

---

## 📤 **Step 4: Push to GitHub**

```powershell
# Check what will be committed (make sure .env is NOT listed!)
git status

# If .env appears in git status, remove it:
git rm --cached app/.env

# Add all changes
git add .

# Commit
git commit -m "Prepare for production deployment"

# Push to GitHub
git push origin main
```

**Verify on GitHub:**
- Go to your repository
- Check that `.env` is NOT visible
- Verify all code is there

---

## 🌐 **Step 5: Deploy to Vercel**

### **Method A: Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Import Project:**
   - Click "Add New" → "Project"
   - Click "Import Git Repository"
   - Select your Leo Club repository
   - Click "Import"

3. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Root Directory: app
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node Version: 18.x
   ```

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://cyffuhudigwapmkffqes.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
   | `VITE_ADMIN_EMAIL` | `jvishula.work@gmail.com` |
   
   **Select environments:** ✅ Production, ✅ Preview, ✅ Development

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://leo-club-website.vercel.app`

### **Method B: Vercel CLI**

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to app directory
cd app

# Login to Vercel
vercel login

# Deploy (first time - creates project)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? leo-club-website
# - Directory? ./ (current directory)
# - Override settings? No

# Add environment variables through CLI
vercel env add VITE_SUPABASE_URL
# Paste: https://cyffuhudigwapmkffqes.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Select: Production, Preview, Development

vercel env add VITE_ADMIN_EMAIL
# Paste: jvishula.work@gmail.com
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## 🔄 **Step 6: Enable CI/CD (Automatic)**

### **What is CI/CD?**
- **Continuous Integration:** Automatically builds your code when you push to GitHub
- **Continuous Deployment:** Automatically deploys to production if build succeeds

### **How it works:**
```
1. You push code to GitHub
   ↓
2. GitHub notifies Vercel (webhook)
   ↓
3. Vercel builds your app
   ↓
4. Vercel runs checks
   ↓
5. Vercel deploys to production
   ↓
6. Live in 2-3 minutes! ✨
```

### **Enable CI/CD:**

**If you used Method A (Dashboard):**
- ✅ Already enabled automatically!
- Every git push triggers deployment

**If you used Method B (CLI):**
```powershell
# Link to Git repository
vercel git connect

# Follow prompts to link your GitHub repo
```

**Verify CI/CD:**
1. Make a small change to any file
2. Push to GitHub: `git push`
3. Check Vercel Dashboard → Deployments
4. You should see a new deployment starting automatically

---

## 🎯 **Step 7: Post-Deployment Testing**

### **Test Your Live Site:**

1. **Visit your Vercel URL**
   ```
   https://leo-club-website.vercel.app
   ```

2. **Test Critical Features:**
   - [ ] Homepage loads correctly
   - [ ] All sections display properly
   - [ ] Navigation works
   - [ ] Awards & Recognition shows featured achievements
   - [ ] Key Projects displays
   - [ ] Admin login works (`/admin`)
   - [ ] Image uploads work
   - [ ] Form submissions work

3. **Test Admin Panel:**
   - [ ] Login with your email
   - [ ] Add/edit achievement
   - [ ] Add/edit project
   - [ ] Add/edit board member
   - [ ] Update featured achievements
   - [ ] Update featured projects
   - [ ] Images upload successfully

4. **Check Performance:**
   - [ ] Pages load fast
   - [ ] Images load properly
   - [ ] Animations work smoothly
   - [ ] Mobile responsive

---

## 🔧 **Step 8: Configure Custom Domain (Optional)**

### **Add Your Custom Domain:**

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Click "Add Domain"
   - Enter: `leoclub.com` (or your domain)

2. **In Your Domain Registrar (e.g., GoDaddy, Namecheap):**
   - Add DNS records as shown by Vercel
   - Typical records:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Wait for DNS Propagation:**
   - Can take 24-48 hours
   - Check status in Vercel Dashboard

---

## 📊 **Monitoring & Updates**

### **Future Updates (CI/CD Workflow):**

```powershell
# 1. Make changes to your code
# Edit files in VS Code...

# 2. Test locally
cd app
npm run build
npm run preview

# 3. Commit and push
git add .
git commit -m "Update: [describe changes]"
git push

# 4. Vercel automatically deploys!
# Check status: vercel.com/dashboard
```

### **View Deployment Logs:**
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click on any deployment to see logs

### **Rollback if Needed:**
1. Go to Vercel Dashboard → Deployments
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

---

## 🆘 **Troubleshooting**

### **Build Fails on Vercel:**
```powershell
# Check build locally first
cd app
npm run build

# If it fails, fix errors and push again
```

### **Environment Variables Not Working:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Make sure all 3 variables are added
3. Make sure "Production" is checked
4. Redeploy: Deployments → Latest → "Redeploy"

### **.env Accidentally Committed:**
```powershell
# Remove from git history
git rm --cached app/.env
git commit -m "Remove .env from tracking"
git push

# Verify .gitignore includes .env
# Then add environment variables to Vercel Dashboard instead
```

### **Images Not Loading:**
1. Check Supabase Storage settings
2. Verify bucket is public
3. Check CORS configuration in Supabase

---

## ✅ **Success Checklist**

- [ ] ✅ Cleanup script executed
- [ ] ✅ Local build successful
- [ ] ✅ .env not in git
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Vercel project created
- [ ] ✅ Environment variables added to Vercel
- [ ] ✅ First deployment successful
- [ ] ✅ Live site tested
- [ ] ✅ Admin panel tested
- [ ] ✅ CI/CD enabled (auto-deploy on push)
- [ ] ✅ Custom domain configured (optional)

---

## 🎉 **You're Live!**

Your Leo Club website is now:
- ✅ Deployed to Vercel
- ✅ Connected to Supabase database
- ✅ Auto-deploying on every git push
- ✅ Secure (environment variables protected)
- ✅ Fast (Vercel Edge Network)
- ✅ Professional CI/CD workflow

**Share your site:**
- Production: `https://leo-club-website.vercel.app`
- GitHub: `https://github.com/YOUR_USERNAME/leo-club-website`

---

## 📝 **Quick Commands Reference**

```powershell
# Cleanup
.\cleanup.ps1

# Test build
cd app && npm run build && npm run preview

# Deploy
git add . && git commit -m "Update" && git push

# Vercel CLI
vercel --prod

# Check logs
vercel logs
```

---

**Need help?** Contact Vercel support or check [Vercel Documentation](https://vercel.com/docs)
