# 🚀 Vercel Deployment Guide - FIFA Draft 2026

## Step 1: Database Setup

### Option A: Vercel Postgres (If Available)
1. Go to your Vercel project dashboard
2. Look for "Storage" tab in left sidebar
3. Click "Create Database"
4. Choose "Postgres" and "Hobby" (free) plan
5. Copy the connection string

### Option B: Supabase (Recommended - Always Free)
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project: `fifa-draft-2026`
4. Go to Settings → Database
5. Copy the connection string

## Step 2: Update Prisma Schema for Production

Before deploying, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: Environment Variables in Vercel

1. Go to your Vercel project
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environment**: Production (and Preview if needed)

## Step 4: Deploy

1. Push your code to GitHub
2. Vercel will auto-deploy
3. Visit your app URL
4. Go to `/api/init` to initialize the database

## Step 5: Verify

- Check Vercel function logs for any errors
- Test the application functionality
- Verify database is working

## Troubleshooting

### If Vercel Postgres is not available:
- Use Supabase (free, 500MB database)
- Or PlanetScale (free, 1GB database)
- Or Railway ($5 credit monthly)

### If build fails:
- Check environment variables are set
- Verify Prisma schema is correct
- Check Vercel function logs

## Database Connection Strings

### Supabase:
```
postgresql://postgres:[password]@[host]:5432/postgres
```

### Vercel Postgres:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

### PlanetScale:
```
mysql://[username]:[password]@[host]/[database]
```
