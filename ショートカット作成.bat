@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js が見つかりません。nodejs.org からインストールしてください。
  pause
  exit /b 1
)
node create-dev-shortcut.js
echo.
pause
