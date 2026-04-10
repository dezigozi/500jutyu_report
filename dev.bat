@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
if exist "%ProgramFiles%\nodejs\npm.cmd" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if defined NVM_SYMLINK set "PATH=%NVM_SYMLINK%;%PATH%"
if defined NVM_HOME set "PATH=%NVM_HOME%;%PATH%"
cmd /k "npm run dev"
