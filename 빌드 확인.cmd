@echo off
setlocal

cd /d "%~dp0"
title Antigravity CYOA Build Check

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

if exist "dist" (
  echo.
  echo Removing old dist folder.
  rmdir /s /q "dist"
  if exist "dist" (
    echo.
    echo [ERROR] Could not remove dist. Close open files or windows and try again.
    pause
    exit /b 1
  )
)

echo.
echo Running build.
echo.
call npm run build

echo.
echo Build command finished.
pause

