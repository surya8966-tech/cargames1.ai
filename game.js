/**
 * Surr 2D Car Race - Web Version
 * Converted from Python/Pygame to HTML5/JavaScript
 */

// Game Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FPS = 60;

// Colors
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const RED = '#FF0000';
const BLUE = '#0000FF';
const GREEN = '#00FF00';
const YELLOW = '#FFFF00';
const GRAY = '#808080';

// Player car settings
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 5;

// Obstacle settings
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 60;
let OBSTACLE_SPEED = 3;
const OBSTACLE_SPAWN_RATE = 60;

// Difficulty settings
const DIFFICULTY_INCREASE_RATE = 0.001;

// Game variables
let canvas, ctx;
let gameRunning = false;
let gameOver = false;
let score = 0;
let spawnTimer = 0;
let difficultyMultiplier = 1.0;
let keys = {};

// Game objects
let player;
let obstacles = [];

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.speed = PLAYER_SPEED;
    }
    
    move() {
        // Move left (but don't go off screen)
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        // Move right (but don't go off screen)
        if (keys['ArrowRight'] && this.x < SCREEN_WIDTH - this.width) {
            this.x += this.speed;
        }
        // Move up (but don't go off screen)
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        // Move down (but don't go off screen)
        if (keys['ArrowDown'] && this.y < SCREEN_HEIGHT - this.height) {
            this.y += this.speed;
        }
    }
    
    draw() {
        // Draw main car body (blue rectangle)
        ctx.fillStyle = BLUE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw car details (windows and lights)
        ctx.fillStyle = WHITE;
        ctx.fillRect(this.x + 5, this.y + 10, this.width - 10, 15); // Windshield
        
        ctx.fillStyle = YELLOW;
        ctx.fillRect(this.x + 5, this.y + 5, 8, 8); // Left headlight
        ctx.fillRect(this.x + this.width - 13, this.y + 5, 8, 8); // Right headlight
    }
    
    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = OBSTACLE_WIDTH;
        this.height = OBSTACLE_HEIGHT;
        this.speed = OBSTACLE_SPEED;
        // Random color for variety
        const colors = [RED, GREEN, YELLOW, GRAY];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    move() {
        this.y += this.speed;
    }
    
    draw() {
        // Draw main car body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw car details
        ctx.fillStyle = WHITE;
        ctx.fillRect(this.x + 5, this.y + this.height - 25, this.width - 10, 15); // Rear window
        
        ctx.fillStyle = RED;
        ctx.fillRect(this.x + 5, this.y + this.height - 5, 8, 8); // Left taillight
        ctx.fillRect(this.x + this.width - 13, this.y + this.height - 5, 8, 8); // Right taillight
    }
    
    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen() {
        return this.y > SCREEN_HEIGHT;
    }
}

// Game functions
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Initialize player
    player = new Player(SCREEN_WIDTH / 2 - PLAYER_WIDTH / 2, SCREEN_HEIGHT - 100);
    
    // Reset game state
    gameOver = false;
    score = 0;
    spawnTimer = 0;
    difficultyMultiplier = 1.0;
    OBSTACLE_SPEED = 3;
    obstacles = [];
    
    // Start game loop
    gameRunning = true;
    gameLoop();
    
    console.log("Starting Surr 2D Car Race!");
    console.log("Use arrow keys to move, avoid the obstacles!");
    console.log("Press R to restart after game over.");
}

function spawnObstacle() {
    const x = Math.random() * (SCREEN_WIDTH - OBSTACLE_WIDTH);
    obstacles.push(new Obstacle(x, -OBSTACLE_HEIGHT));
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].move();
        
        // Remove obstacles that are off screen and increase score
        if (obstacles[i].isOffScreen()) {
            obstacles.splice(i, 1);
            score += 10;
            updateScoreDisplay();
        }
    }
}

function checkCollisions() {
    const playerRect = player.getRect();
    
    for (let obstacle of obstacles) {
        const obstacleRect = obstacle.getRect();
        
        // Simple rectangle collision detection
        if (playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y) {
            return true;
        }
    }
    return false;
}

function updateDifficulty() {
    difficultyMultiplier += DIFFICULTY_INCREASE_RATE;
    OBSTACLE_SPEED = 3 * difficultyMultiplier;
}

function drawRoad() {
    // Fill background with dark gray
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw road edges
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, 10, SCREEN_HEIGHT); // Left edge
    ctx.fillRect(SCREEN_WIDTH - 10, 0, 10, SCREEN_HEIGHT); // Right edge
    
    // Draw lane markings (dashed lines)
    ctx.fillStyle = YELLOW;
    const laneWidth = SCREEN_WIDTH / 3;
    
    for (let lane = 1; lane < 3; lane++) {
        const x = lane * laneWidth;
        for (let y = 0; y < SCREEN_HEIGHT; y += 40) {
            ctx.fillRect(x - 2, y, 4, 20);
        }
    }
}

function drawUI() {
    ctx.fillStyle = WHITE;
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    
    // Instructions
    ctx.font = '14px Arial';
    ctx.fillText('Arrow Keys: Move', 20, SCREEN_HEIGHT - 40);
    ctx.fillText('R: Restart', 20, SCREEN_HEIGHT - 20);
}

function drawGameOver() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Game over text
    ctx.fillStyle = RED;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50);
    
    // Final score
    ctx.fillStyle = WHITE;
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    
    // Restart instructions
    ctx.font = '18px Arial';
    ctx.fillText('Press R to Restart', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);
    
    // Reset text alignment
    ctx.textAlign = 'left';
}

function restartGame() {
    gameOver = false;
    score = 0;
    spawnTimer = 0;
    difficultyMultiplier = 1.0;
    OBSTACLE_SPEED = 3;
    
    // Reset player position
    player = new Player(SCREEN_WIDTH / 2 - PLAYER_WIDTH / 2, SCREEN_HEIGHT - 100);
    
    // Clear all obstacles
    obstacles = [];
    
    updateScoreDisplay();
    console.log("Game restarted!");
}

function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
}

function gameLoop() {
    if (!gameRunning) return;
    
    if (!gameOver) {
        // Update player
        player.move();
        
        // Spawn obstacles
        spawnTimer++;
        if (spawnTimer >= OBSTACLE_SPAWN_RATE) {
            spawnObstacle();
            spawnTimer = 0;
        }
        
        // Update obstacles
        updateObstacles();
        
        // Check for collisions
        if (checkCollisions()) {
            gameOver = true;
            console.log(`Game Over! Final Score: ${score}`);
        }
        
        // Update difficulty
        updateDifficulty();
    }
    
    // Draw everything
    drawRoad();
    
    if (!gameOver) {
        // Draw game objects
        player.draw();
        for (let obstacle of obstacles) {
            obstacle.draw();
        }
        
        // Draw UI
        drawUI();
    } else {
        // Draw game over screen
        drawGameOver();
    }
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Handle special keys
    if (e.key === 'r' || e.key === 'R') {
        if (gameOver) {
            restartGame();
        }
    }
    
    if (e.key === 'Escape') {
        // Pause/unpause functionality could be added here
        console.log('ESC pressed');
    }
    
    // Prevent default behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Start the game when page loads
window.addEventListener('load', () => {
    initGame();
});

// Handle window focus/blur for better performance
window.addEventListener('blur', () => {
    // Pause game when window loses focus
    keys = {}; // Clear all keys
});

window.addEventListener('focus', () => {
    // Resume game when window gains focus
    keys = {};
});
