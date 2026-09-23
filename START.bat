@echo off
setlocal EnableExtensions

title Nexzen Skin Analysis - Startup
cd /d "%~dp0"

echo.
echo ============================================
echo        NEXZEN SKIN ANALYSIS
echo        Local Windows Startup
echo ============================================
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo Python 3.12 is required but was not found.
    echo Install Python from https://www.python.org/downloads/
    echo Make sure "Add Python to PATH" is enabled, then run START.bat again.
    pause
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required but was not found.
    echo Install Node.js LTS from https://nodejs.org/
    pause
    exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating the local Python environment...
    python -m venv .venv
    if errorlevel 1 (
        echo Could not create the Python environment.
        pause
        exit /b 1
    )
)

echo Installing or updating Python dependencies...
call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip
python -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    echo Python dependency installation failed.
    pause
    exit /b 1
)

if not exist "node_modules\next\package.json" (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo Node.js dependency installation failed.
        pause
        exit /b 1
    )
)

echo Starting the Python model backend on port 8000...
start "Nexzen Backend" cmd /k "cd /d ^"%~dp0^" && call .venv\Scripts\activate.bat && python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000"

echo Starting the Next.js frontend on port 3000...
start "Nexzen Frontend" cmd /k "cd /d ^"%~dp0^" && set NEXT_PUBLIC_ANALYSIS_API_URL=http://127.0.0.1:8000/analyze && npm run dev"

echo Waiting for the frontend to start...
timeout /t 8 /nobreak >nul
start "" http://localhost:3000

echo.
echo Nexzen is starting at http://localhost:3000
echo Keep the Backend and Frontend windows open while using the app.
echo You can close both windows when the demo is finished.
echo.
pause