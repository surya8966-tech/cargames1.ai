#!/usr/bin/env python3
"""
Setup script for Surr 2D Car Race
=====================================

This script helps set up and run the car game locally.
It checks for dependencies and installs them if needed.
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 6):
        print("❌ Python 3.6 or higher is required!")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def install_requirements():
    """Install required packages from requirements.txt"""
    try:
        print("📦 Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def check_pygame():
    """Check if pygame is available"""
    try:
        import pygame
        print(f"✅ Pygame {pygame.version.ver} is available")
        return True
    except ImportError:
        print("❌ Pygame not found")
        return False

def run_game():
    """Run the car game"""
    try:
        print("🚗 Starting the car game...")
        print("Use arrow keys to move, ESC to quit!")
        subprocess.run([sys.executable, "car_game.py"])
    except FileNotFoundError:
        print("❌ car_game.py not found in current directory")
    except KeyboardInterrupt:
        print("\n👋 Game interrupted by user")

def main():
    """Main setup function"""
    print("🎮 Surr 2D Car Race Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if we're in the right directory
    if not os.path.exists("car_game.py"):
        print("❌ car_game.py not found!")
        print("Make sure you're in the correct directory")
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("Trying to install pygame directly...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame"])
            print("✅ Pygame installed successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to install pygame")
            sys.exit(1)
    
    # Verify pygame installation
    if not check_pygame():
        print("❌ Setup failed - pygame not available")
        sys.exit(1)
    
    print("\n🎉 Setup complete!")
    print("=" * 40)
    
    # Ask user if they want to run the game
    while True:
        choice = input("\nDo you want to run the game now? (y/n): ").lower().strip()
        if choice in ['y', 'yes']:
            run_game()
            break
        elif choice in ['n', 'no']:
            print("👍 Setup complete! Run 'python car_game.py' when ready to play.")
            break
        else:
            print("Please enter 'y' for yes or 'n' for no")

if __name__ == "__main__":
    main()
