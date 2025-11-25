# Vercel Deployment Guide

## ✅ Automatic Optimizations (Already Done)

1. **Next.js Configuration** (`next.config.js`)
   - ✅ Image optimization enabled (AVIF & WebP formats)
   - ✅ SWC minification enabled
   - ✅ Compression enabled
   - ✅ Powered by header removed

2. **Build Configuration**
   - ✅ Build script configured correctly
   - ✅ Static page generation working
   - ✅ Build tested successfully

3. **File Structure**
   - ✅ `.vercelignore` created to exclude unnecessary files
   - ✅ Public assets properly organized

## 📋 Manual Steps for Vercel Deployment

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Next.js

### 2. Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Build Command:** Leave empty (Vercel auto-detects `npm run build`)

**Output Directory:** Leave empty (Vercel handles this automatically for Next.js)

**Install Command:** Leave empty (Vercel auto-detects `npm install`)

**Root Directory:** Leave empty (unless your Next.js app is in a subdirectory)

**⚠️ IMPORTANT:** Do NOT manually set Output Directory to `.next` - let Vercel handle it automatically!

### 3. Environment Variables (if needed)

If you add any environment variables later:
- Go to Project Settings → Environment Variables
- Add variables for Production, Preview, and Development

**Currently no environment variables are needed.**

### 4. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Run `npm run build`
   - Deploy to production
3. You'll get a URL like: `your-project.vercel.app`

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 🔍 Post-Deployment Checklist

- [ ] Test the live site
- [ ] Verify images load correctly
- [ ] Check GSAP animations work
- [ ] Test navbar scroll behavior
- [ ] Verify favicon appears
- [ ] Test on mobile devices
- [ ] Check page speed (Vercel Analytics)

## 📊 Performance Optimizations Already Applied

- ✅ Next.js Image component for optimized images
- ✅ Static page generation
- ✅ Code splitting
- ✅ SWC minification
- ✅ Image format optimization (AVIF/WebP)
- ✅ Compression enabled

## 🐛 Troubleshooting

### 404 Not Found Error

**Most Common Causes:**

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check the "Build Logs" tab
   - Look for any errors or warnings

2. **Verify Project Settings:**
   - Go to Project Settings → General
   - **Framework Preset:** Should be "Next.js"
   - **Build Command:** Should be empty (auto-detected) OR `npm run build`
   - **Output Directory:** Should be **EMPTY** (not `.next` or `out`)
   - **Install Command:** Should be empty (auto-detected) OR `npm install`
   - **Root Directory:** Should be empty (unless app is in subfolder)

3. **Check Node.js Version:**
   - Go to Project Settings → General
   - **Node.js Version:** Should be 18.x or 20.x
   - If not set, Vercel will use 18.x by default

4. **Redeploy:**
   - After fixing settings, trigger a new deployment
   - Go to Deployments → Click "Redeploy" on latest deployment

5. **Clear Build Cache:**
   - Project Settings → General → Clear Build Cache
   - Then redeploy

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses 18.x by default)
- Make sure `sass` is in `devDependencies` (it is ✅)

### Images Not Loading
- Ensure images are in `/public` folder
- Check image paths are correct (starting with `/`)
- Verify files are committed to Git

### GSAP/Animations Not Working
- Ensure `"use client"` directive is on components using GSAP
- Check browser console for errors

## 📝 Notes

- The site is fully static (no API routes)
- All pages are pre-rendered at build time
- No server-side rendering needed
- Vercel will automatically handle:
  - CDN distribution
  - Edge caching
  - Automatic HTTPS
  - Preview deployments for PRs

