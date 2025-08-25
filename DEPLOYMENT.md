# 🚀 Deployment Guide - FIFA Draft 2026

## Deploying to Vercel

### 1. Database Setup (Choose One)

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string
4. Add as environment variable: `DATABASE_URL`

#### Option B: External Database
- **PlanetScale**: `mysql://username:password@host/database`
- **Supabase**: `postgresql://postgres:password@host:5432/postgres`
- **Railway**: Check your project settings

#### Option C: SQLite (Development Only)
- ⚠️ **Not recommended for production**
- Data resets on each deployment
- Use only for testing

### 2. Environment Variables in Vercel

Add these in your Vercel project settings:

```env
DATABASE_URL="your-production-database-url"
```

### 3. Deploy Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - Add `DATABASE_URL` in Vercel dashboard
   - Redeploy after adding variables

4. **Database Migration**:
   - After first deployment, visit: `https://your-app.vercel.app/api/init`
   - This will initialize the database with users

### 4. Accessing Database in Production

#### Prisma Studio (Development Only)
```bash
npx prisma studio
```
- Only works locally
- Cannot access production database directly

#### Production Database Access
- **Vercel Postgres**: Use Vercel dashboard
- **External DB**: Use your provider's dashboard
- **PlanetScale**: Built-in data browser
- **Supabase**: Built-in table editor

### 5. Troubleshooting

#### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure database is accessible from Vercel
- Verify SSL settings for external databases

#### Build Errors
- Ensure `prisma generate` runs during build
- Check all dependencies are installed

#### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Test database connection

### 6. Monitoring

- Use Vercel Analytics
- Monitor function execution times
- Check database performance
- Set up error tracking (Sentry, etc.)

## 🎯 Quick Deploy Checklist

- [ ] Database provider chosen and configured
- [ ] Environment variables set in Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Initial deployment successful
- [ ] Database initialized via `/api/init`
- [ ] Application tested in production
- [ ] Domain configured (optional)
