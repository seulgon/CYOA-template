@echo off
setlocal

set "TARGET_DIR=%~dp0"
if "%TARGET_DIR:~-1%"=="\" set "TARGET_DIR=%TARGET_DIR:~0,-1%"
set "NOTEBOOKLM_CODE_EXPORT_TARGET_DIR=%TARGET_DIR%"

set "PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"

"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference = 'Stop';" ^
  "$targetDir = $env:NOTEBOOKLM_CODE_EXPORT_TARGET_DIR;" ^
  "$desktopRoot = [Environment]::GetFolderPath('Desktop');" ^
  "$scriptPath = Get-ChildItem -Path $desktopRoot -Recurse -Filter 'export-code-docx.mjs' -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like '*notebooklm-code-export*' } | Select-Object -First 1 -ExpandProperty FullName;" ^
  "if (-not $scriptPath) { throw 'Could not find export-code-docx.mjs under Desktop.' }" ^
  "Set-Location -LiteralPath $targetDir; & node $scriptPath"

set "EXIT_CODE=%ERRORLEVEL%"
echo.
if "%EXIT_CODE%"=="0" (
  echo Done. Check this folder for the generated DOCX file.
) else (
  echo Export failed. Read the messages above.
)

call :maybe_pause
exit /b %EXIT_CODE%

:maybe_pause
if /I "%NOTEBOOKLM_CODE_EXPORT_NO_PAUSE%"=="1" exit /b 0
pause
exit /b 0
