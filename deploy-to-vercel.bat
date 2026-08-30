@echo off
title Deploy Aura K-POS to Vercel
color 0b
echo ================================================================
echo    🚀 AURA K-POS ENTERPRISE - VERCEL ONE-CLICK DEPLOYMENT
echo ================================================================
echo.
echo [Step 1] Switching to Vercel Deployment Directory...
cd /d "i:\AntigravityWorkspace\vercel-deployment"

echo.
echo [Step 2] Launching Vercel Production Deploy...
echo (If this is your first time, Vercel will open a browser login window)
echo.

npx vercel --prod

echo.
echo ================================================================
echo    ✅ Deployment Finished! Check the Vercel URL above.
echo ================================================================
pause
