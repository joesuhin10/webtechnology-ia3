@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================
echo   SmartStation — Installing Dependencies
echo ========================================
call npm install
pause
