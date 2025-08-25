#!/bin/bash

echo "🚀 FIFA Draft 2026 - Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote repository found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

echo "✅ Git repository found"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Vercel - $(date)"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your GitHub repository"
    echo "3. Add environment variable: DATABASE_URL"
    echo "4. Deploy!"
    echo ""
    echo "📋 Remember to:"
    echo "- Set up a production database (Vercel Postgres recommended)"
    echo "- Visit /api/init after deployment to initialize the database"
    echo "- Test the application thoroughly"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi
