@echo off
setlocal enabledelayedexpansion
title Signora AI - Master Services Launcher

echo ========================================================
echo       SIGNORA AI - ASSISTIVE PLATFORM LAUNCHER           
echo ========================================================
echo.
echo Launching all 5 microservices in separate terminal windows...
echo.

set ROOT_DIR=%~dp0
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%

:: 1. AI Language & Morphology Engine (Python / FastAPI :8000)
echo [1/5] Starting AI Service (FastAPI :8000)...
start "Signora - 1. AI Language Service (:8000)" cmd /k "cd /d "%ROOT_DIR%\ai-service" && title Signora AI Service (:8000) && color 0B && python run_server.py"
timeout /t 2 /nobreak >nul

:: 2. Computer Vision & Landmark Engine (Python / MediaPipe :8001)
echo [2/5] Starting Computer Vision Service (MediaPipe :8001)...
start "Signora - 2. Computer Vision Service (:8001)" cmd /k "cd /d "%ROOT_DIR%\computer-vision" && title Signora CV Service (:8001) && color 0D && python run_server.py"
timeout /t 2 /nobreak >nul

:: 3. Core Backend Gateway (Node.js / Express :5000)
echo [3/5] Starting Backend Gateway (Express :5000)...
start "Signora - 3. Backend Gateway (:5000)" cmd /k "cd /d "%ROOT_DIR%\backend" && title Signora Backend Gateway (:5000) && color 0A && npm start"
timeout /t 2 /nobreak >nul

:: 4. Real-Time Duplex Microservice (Node.js / WebSockets :5002)
echo [4/5] Starting Duplex WebSocket Microservice (:5002)...
start "Signora - 4. Duplex Microservice (:5002)" cmd /k "cd /d "%ROOT_DIR%\microservice" && title Signora Duplex Service (:5002) && color 0E && npm start"
timeout /t 2 /nobreak >nul

:: 5. Frontend Client (Vite / React 19 :5173)
echo [5/5] Starting Frontend Client (Vite :5173)...
start "Signora - 5. Frontend UI (:5173)" cmd /k "cd /d "%ROOT_DIR%\frontend" && title Signora Frontend UI (:5173) && color 0C && npm run dev"

echo.
echo ========================================================
echo   ALL 5 SERVICES LAUNCHED SUCCESSFULLY IN SEPARATE TABS 
echo ========================================================
echo.
echo   * AI Translation Engine:    http://localhost:8000/docs
echo   * Computer Vision Service:  http://localhost:8001/docs
echo   * Core Backend Gateway:     http://localhost:5000/api/v1/health
echo   * Duplex Real-Time Server:  http://localhost:5002/health (ws://)
echo   * Frontend 3D Interface:    http://localhost:5173
echo.
echo Press any key to exit this launcher window (services will stay running)...
pause >nul

