# 🆓 Supabase Setup Guide (Free PostgreSQL)

## Why Supabase?
- ✅ **Free**: 500MB database, 50MB file storage
- ✅ **PostgreSQL**: Native support
- ✅ **Dashboard**: Built-in data browser
- ✅ **Real-time**: Future features
- ✅ **Auth**: Built-in authentication (if needed later)

## Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 2. Create New Project
1. Click "New Project"
2. Choose organization
3. Enter project name: `fifa-draft-2026`
4. Enter database password (save it!)
5. Choose region (closest to your users)
6. Click "Create new project"

### 3. Get Connection String
1. Go to Settings → Database
2. Copy the connection string
3. It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

### 4. Update Environment Variables
In your Vercel project:
```
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### 5. Deploy and Initialize
1. Deploy to Vercel
2. Visit: `https://your-app.vercel.app/api/init`
3. Database will be created automatically

## Database Access

### Supabase Dashboard
- Go to your project dashboard
- Click "Table Editor"
- View/edit all your data
- Much better than Prisma Studio for production!

### Tables You'll See
- `users` - Your 8 players
- `drafts` - Draft information
- `picks` - Player selections
- `formations` - Team formations

## Benefits Over Vercel Postgres
- ✅ **Better Dashboard**: Visual data editor
- ✅ **More Storage**: 500MB vs 256MB
- ✅ **Real-time**: Future features
- ✅ **SQL Editor**: Run custom queries
- ✅ **Backups**: Automatic backups
- ✅ **API**: REST and GraphQL APIs

## Migration from SQLite
Your existing data won't transfer automatically, but:
1. Deploy with Supabase
2. Visit `/api/init` to create fresh database
3. All users start fresh (which is fine for a draft!)

## Cost
- **Free Forever**: 500MB database
- **Paid Plans**: Start at $25/month (if you ever need more)
- **No hidden costs**: Clear pricing

## Support
- Great documentation
- Active community
- Discord support
- GitHub issues
