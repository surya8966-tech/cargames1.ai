@echo off
echo 🎮 Surr 2D Car Race Launcher
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo ✅ Python detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo Trying to install pygame directly...
    pip install pygame
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pygame
        pause
        exit /b 1
    )
)

echo ✅ Dependencies ready
echo.

REM Run the game
echo 🚗 Starting the car game...
echo Use arrow keys to move, ESC to quit!
echo.
python car_game.py

echo.
echo 👋 Thanks for playing!
pause
