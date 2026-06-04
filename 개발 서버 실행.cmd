@echo off
setlocal

cd /d "%~dp0"
title Antigravity CYOA Dev Server

if not exist "package.json" (
  echo [ERROR] package.json was not found.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Please install Node.js.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo node_modules was not found. Running npm install first.
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting dev server. The browser should open automatically.
echo Close this window to stop the dev server.
echo.
call npm run dev -- --open

echo.
echo Dev server stopped.
pause
