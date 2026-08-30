@echo off
title Push Aura K-POS to GitHub (jlim33/aura-kpos)
color 0a
echo ================================================================
echo    🚀 PUSHING AURA K-POS TO GITHUB (jlim33/aura-kpos)
echo ================================================================
echo.

cd /d "i:\AntigravityWorkspace\vercel-deployment"

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/jlim33/aura-kpos.git

git add .
git commit -m "feat: Aura K-POS Enterprise & Technological Singularity Showcase" 2>nul

echo.
echo Pushing to GitHub (https://github.com/jlim33/aura-kpos.git)...
git push -u origin main

echo.
echo ================================================================
echo    ✅ Push Complete! Now deploy on Vercel at https://vercel.com/new
echo ================================================================
pause
