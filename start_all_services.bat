@echo off
setlocal enabledelayedexpansion
title Hastivo - Master Services Launcher

echo ========================================================
echo       HASTIVO - ASSISTIVE PLATFORM LAUNCHER           
echo ========================================================
echo.
echo Launching all 5 platform services in separate terminal windows...
echo.

set ROOT_DIR=%~dp0
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%

:: Detect Python executable (prefer project virtualenv if present)
set PYTHON_BIN=python
if exist "%ROOT_DIR%\venv\Scripts\python.exe" (
    set "PYTHON_BIN=%ROOT_DIR%\venv\Scripts\python.exe"
    echo [Environment] Using virtual environment Python: !PYTHON_BIN!
)

:: 1. AI Language & Morphology Engine (Python / FastAPI :8000)
echo [1/5] Starting AI Language Service (FastAPI :8000)...
start "Hastivo - 1. AI Language Service (:8000)" cmd /k "cd /d "%ROOT_DIR%\models" && title Hastivo AI Service (:8000) && color 0B && "!PYTHON_BIN!" run_server.py"
timeout /t 2 /nobreak >nul

:: 2. Computer Vision & Landmark Engine (Python / MediaPipe :8001)
echo [2/5] Starting Computer Vision Service (MediaPipe :8001)...
start "Hastivo - 2. Computer Vision Service (:8001)" cmd /k "cd /d "%ROOT_DIR%\images" && title Hastivo CV Service (:8001) && color 0D && "!PYTHON_BIN!" run_server.py"
timeout /t 2 /nobreak >nul

:: 3. Core Backend Gateway (Node.js / Express :5000)
echo [3/5] Starting Backend Gateway (Express :5000)...
start "Hastivo - 3. Backend Gateway (:5000)" cmd /k "cd /d "%ROOT_DIR%\server" && title Hastivo Backend Gateway (:5000) && color 0A && npm start"
timeout /t 2 /nobreak >nul

:: 4. Real-Time Duplex Microservice (Node.js / WebSockets :5002)
echo [4/5] Starting Duplex WebSocket Microservice (:5002)...
start "Hastivo - 4. Duplex Microservice (:5002)" cmd /k "cd /d "%ROOT_DIR%\services" && title Hastivo Duplex Service (:5002) && color 0E && npm start"
timeout /t 2 /nobreak >nul

:: 5. Client Application (TanStack Start / React 19 + Smooth UI Suite)
echo [5/5] Starting Client Application (TanStack Start + Smooth UI)...
start "Hastivo - 5. Client Workspace" cmd /k "cd /d "%ROOT_DIR%\client" && title Hastivo Client Workspace && color 0C && npm run dev"

echo.
echo ========================================================
echo   ALL 5 SERVICES LAUNCHED SUCCESSFULLY IN SEPARATE TABS 
echo ========================================================
echo.
echo   * AI Translation Engine:    http://localhost:8000/docs
echo   * Computer Vision Service:  http://localhost:8001/docs
echo   * Core Backend Gateway:     http://localhost:5000/api/v1/health
echo   * Duplex Real-Time Server:  http://localhost:5002/health (ws://)
echo   * Client Web Application:   http://localhost:3000 (or :5173)
echo.
echo Press any key to exit this launcher window (services will stay running)...
pause >nul
