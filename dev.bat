@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
echo 開発モードで起動中... しばらくお待ちください
call npm run dev
