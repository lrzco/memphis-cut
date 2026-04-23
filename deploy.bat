@echo off
chcp 65001 >nul
title Memphis Cut - Deployment
color 0E

cd /d "C:\Users\noval\iCloudDrive\memphis-cut"

echo.
echo  ============================================
echo    MEMPHIS CUT - DEPLOIEMENT AUTOMATIQUE
echo  ============================================
echo.

git status --short
echo.

set /p commit_msg="  Message de commit (ENTREE pour 'Mise a jour') : "
if "%commit_msg%"=="" set commit_msg=Mise a jour

echo.
echo  Creation du commit...
git add .
git commit -m "%commit_msg%"

echo.
echo  Envoi vers GitHub...
git push

color 0A
echo.
echo  ============================================
echo    DEPLOIEMENT REUSSI !
echo    Vercel redeploiera dans ~1 minute
echo  ============================================
echo.
pause