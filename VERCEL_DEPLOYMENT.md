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

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

**Root Directory:** Leave empty (or set if your Next.js app is in a subdirectory)

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

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses 18.x by default)

### Images Not Loading
- Ensure images are in `/public` folder
- Check image paths are correct (starting with `/`)

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

