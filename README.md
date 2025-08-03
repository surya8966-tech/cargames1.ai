# Surr 2D Car Race

A beginner-friendly car racing game built with Python and Pygame where you control a car and avoid obstacles to survive as long as possible.

## Features

- **Simple Controls**: Use arrow keys to move your car in all directions
- **Dynamic Obstacles**: Randomly generated cars coming from the top
- **Progressive Difficulty**: Game speed increases over time
- **Score System**: Earn points for surviving obstacles
- **Game Over & Restart**: Collision detection with restart functionality
- **Visual Design**: Colorful cars with headlights, taillights, and road markings

## Requirements

- Python 3.x
- Pygame library

## Installation & Setup

### Method 1: Run from GitHub (Recommended)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/surr-2d-car-race.git
cd surr-2d-car-race
```

#### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 3: Run the Game
```bash
python car_game.py
```

### Method 2: Manual Setup

#### Step 1: Install Python
If you don't have Python installed:
1. Download Python from [python.org](https://python.org)
2. During installation, make sure to check "Add Python to PATH"

#### Step 2: Download Files
1. Download `car_game.py` and `requirements.txt`
2. Place them in a folder (e.g., `car-game`)

#### Step 3: Install Dependencies
Open Command Prompt in the game folder and run:
```bash
pip install -r requirements.txt
```

#### Step 4: Run the Game
```bash
python car_game.py
```

## How to Play

### Controls
- **Arrow Keys**: Move your car (Left, Right, Up, Down)
- **R**: Restart game after game over
- **ESC or Q**: Quit the game

### Objective
- Control the blue car (your player)
- Avoid colliding with the colored obstacle cars coming from the top
- Survive as long as possible to get a high score
- The game gets faster and more challenging over time

### Scoring
- You earn 10 points for each obstacle that passes by safely
- Your final score is displayed when the game ends

## Game Features Explained

### Player Car (Blue)
- Moves in all four directions
- Has white windshield and yellow headlights
- Cannot move outside the screen boundaries

### Obstacle Cars (Various Colors)
- Spawn randomly from the top of the screen
- Move downward at increasing speeds
- Have white rear windows and red taillights
- Different colors for visual variety

### Road Design
- Dark gray road surface
- White dashed lane markings
- White road edges
- Three-lane highway layout

### Difficulty Progression
- Game starts at normal speed
- Speed gradually increases over time
- More challenging the longer you survive

## Code Structure

The game is organized into clear sections:

1. **Constants & Settings**: Game dimensions, colors, speeds
2. **Player Class**: Handles player car movement and rendering
3. **Obstacle Class**: Manages enemy cars and their behavior
4. **Game Class**: Main game logic, collision detection, scoring
5. **Main Function**: Game initialization and error handling

## Customization Ideas

Want to modify the game? Here are some beginner-friendly changes:

- **Change Colors**: Modify the color constants at the top
- **Adjust Speed**: Change `PLAYER_SPEED` or `OBSTACLE_SPEED`
- **Screen Size**: Modify `SCREEN_WIDTH` and `SCREEN_HEIGHT`
- **Spawn Rate**: Change `OBSTACLE_SPAWN_RATE` (lower = more obstacles)
- **Car Sizes**: Adjust `PLAYER_WIDTH`, `PLAYER_HEIGHT`, etc.

## Troubleshooting

### "pygame is not installed" Error
Run: `pip install pygame`

### "python is not recognized" Error
Make sure Python is added to your system PATH during installation

### Game Runs Too Fast/Slow
Modify the `FPS` constant (default is 60)

### Performance Issues
Try reducing the screen size or FPS if the game runs slowly

## File Structure
```
car_game.py     # Main game file (run this)
README.md       # This instruction file
```

## Next Steps

Once you've played the basic game, try these enhancements:
- Add power-ups or bonuses
- Create different types of obstacles
- Add sound effects
- Implement multiple lives
- Create a high score system
- Add background music

Enjoy the game and happy coding! 🚗💨
