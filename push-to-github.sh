#!/bin/bash
echo "================================================================"
echo "🚀 Pushing Aura K-POS Enterprise to GitHub (jlim33/aura-kpos)..."
echo "================================================================"
echo ""

cd "i:/AntigravityWorkspace/vercel-deployment"

# Set branch and remote
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin https://github.com/jlim33/aura-kpos.git

# Stage all files and commit if needed
git add .
git commit -m "feat: Aura K-POS Enterprise & Technological Singularity Showcase" 2>/dev/null

# Push to GitHub
echo "Pushing to https://github.com/jlim33/aura-kpos.git ..."
git push -u origin main

echo ""
echo "================================================================"
echo "✅ GitHub Push Finished! Next Step: Deploy on Vercel"
echo "👉 Go to https://vercel.com/new and select 'aura-kpos'!"
echo "================================================================"
