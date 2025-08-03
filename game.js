/**
 * Surr 2D Car Race - Web Version
 * FIXED - Simple working implementation
 */

// Game variables
let canvas, ctx;
let gameRunning = false;
let gameOver = false;
let score = 0;
let frameCount = 0;
let keys = {};

// Player object
let player = {
    x: 380,
    y: 500,
    width: 40,
    height: 60,
    speed: 5
};

let obstacles = [];

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) {
        console.error('Canvas not found!');
        return;
    }
    
    console.log('Game initialized successfully!');
    gameRunning = true;
    gameLoop();
}

// Create obstacle
function createObstacle() {
    return {
        x: Math.random() * (canvas.width - 40),
        y: -60,
        width: 40,
        height: 60,
        speed: 3,
        color: ['#FF0000', '#00FF00', '#FFFF00', '#808080'][Math.floor(Math.random() * 4)]
    };
}

// Update game
function update() {
    if (gameOver) return;
    
    // Move player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    
    // Spawn obstacles
    if (frameCount % 60 === 0) {
        obstacles.push(createObstacle());
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;
        
        // Remove off-screen obstacles
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            updateScore();
        }
        // Check collision
        else if (obstacles[i].x < player.x + player.width &&
                obstacles[i].x + obstacles[i].width > player.x &&
                obstacles[i].y < player.y + player.height &&
                obstacles[i].y + obstacles[i].height > player.y) {
            gameOver = true;
            console.log('Game Over! Score:', score);
        }
    }
    
    frameCount++;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw road background
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road edges
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
    
    // Draw lane lines
    ctx.fillStyle = '#FFFF00';
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.fillRect(canvas.width / 3 - 2, y, 4, 20);
        ctx.fillRect((canvas.width * 2) / 3 - 2, y, 4, 20);
    }
    
    if (!gameOver) {
        // Draw player
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw player details
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(player.x + 5, player.y + 10, 30, 15);
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(player.x + 5, player.y + 5, 8, 8);
        ctx.fillRect(player.x + 27, player.y + 5, 8, 8);
        
        // Draw obstacles
        for (let obstacle of obstacles) {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Obstacle details
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(obstacle.x + 5, obstacle.y + 35, 30, 15);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(obstacle.x + 5, obstacle.y + 52, 8, 8);
            ctx.fillRect(obstacle.x + 27, obstacle.y + 52, 8, 8);
        }
        
        // Draw UI
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 20, 30);
        ctx.font = '14px Arial';
        ctx.fillText('Arrow Keys: Move', 20, canvas.height - 40);
        ctx.fillText('R: Restart', 20, canvas.height - 20);
    } else {
        // Game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2);
        
        ctx.font = '18px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
        
        ctx.textAlign = 'left';
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Restart game
function restart() {
    gameOver = false;
    score = 0;
    frameCount = 0;
    player.x = 380;
    player.y = 500;
    obstacles = [];
    updateScore();
    console.log('Game restarted!');
}

// Update score display
function updateScore() {
    const scoreElement = document.getElementById('scoreDisplay');
    if (scoreElement) {
        scoreElement.textContent = 'Score: ' + score;
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if ((e.key === 'r' || e.key === 'R') && gameOver) {
        restart();
    }
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start game when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, starting game...');
    setTimeout(init, 100);
});
