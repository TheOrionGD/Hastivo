@echo off
setlocal
title Hastivo - Build Client & Verification

echo ========================================================
echo       HASTIVO - CLIENT PRODUCTION BUILD & VERIFY        
echo ========================================================
echo.

set ROOT_DIR=%~dp0
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%

echo [1/2] Running ESLint check on Client...
cd /d "%ROOT_DIR%\client"
call npm run lint
if %errorlevel% neq 0 (
    echo [ERROR] ESLint check failed.
    pause
    exit /b %errorlevel%
)
echo [OK] Lint check clean (0 errors, 0 warnings).
echo.

echo [2/2] Running Vite & Nitro Cloudflare SSR Production Build...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Client build failed.
    pause
    exit /b %errorlevel%
)
echo.
echo ========================================================
echo   HASTIVO CLIENT PRODUCTION BUILD SUCCESSFUL!
echo ========================================================
echo Output directory: client/.output/
echo.
pause

