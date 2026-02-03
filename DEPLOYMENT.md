# Vercel Deployment Guide

## Prerequisites
- A Vercel account (free tier works)
- Your Supabase database credentials

## Steps

### 1. Push to Git Repository
Make sure your code is committed and pushed to GitHub, GitLab, or Bitbucket.

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Select your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (already configured in package.json)
   - **Output Directory**: `.next` (default)

### 3. Configure Environment Variables
Before deploying, click **"Environment Variables"** and add:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | Your Supabase connection string (port 5432) |
| `DIRECT_URL` | Same as DATABASE_URL |

**Example:**
```
DATABASE_URL=postgresql://postgres.wtdzngxszifzuxnydggo:E0q5ekcUgQioEsod@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.wtdzngxszifzuxnydggo:E0q5ekcUgQioEsod@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

> ⚠️ **Important**: Make sure to apply these to all environments (Production, Preview, Development)

### 4. Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (~2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### 5. Seed Database (One-time)
After first deployment, visit:
```
https://your-project.vercel.app/api/migrate
```

This will populate your database with initial data.

## Troubleshooting

### Build fails with "Prisma Client not generated"
- Make sure your `package.json` build script includes `npx prisma generate`
- Current script: `"build": "npx prisma generate && next build"` ✅

### Build fails with "Can't reach database"
- Verify `DATABASE_URL` is set in Vercel environment variables
- Make sure the connection string is correct (port 5432, not 6543)
- Check that your Supabase database is accessible

### Pages show old data
- Clear the deployment cache in Vercel
- Redeploy with **"Redeploy with Cache Cleared"**

## Post-Deployment

Your application is now live! The following features are available:

- **Customer-facing pages**: `/`, `/services`, `/book`, `/contact`
- **Admin Panel**: `/admin/login` → Dashboard, Services, Staff, Bookings, etc.
- **Worker Portal**: `/worker/login` → View assigned jobs
- **Owner Dashboard**: `/owner/dashboard` → Analytics and overview

## Custom Domain (Optional)
To add a custom domain:
1. Go to **Settings** → **Domains**
2. Add your domain
3. Update your DNS records as instructed
