@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================
echo   Starting SmartStation Store (Prod)
echo   URL: http://localhost:3000
echo ========================================
call npm run start
pause
