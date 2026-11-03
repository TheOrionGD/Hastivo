@echo off
setlocal
title Signora AI - Graceful Shutdown

echo ========================================================
echo       SIGNORA AI - TERMINATING RUNNING SERVICES         
echo ========================================================
echo.

echo Terminating Node processes on ports 5000, 5002, 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 :5002 :5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo Terminating Python processes on ports 8000, 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 :8001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo All Signora AI services have been stopped.
echo ========================================================
timeout /t 3

