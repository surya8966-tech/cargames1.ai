"""
Surr 2D Car Race
=====================================

A simple car racing game where you avoid obstacles and try to survive as long as possible.

Controls:
- Arrow Keys: Move the car (Left, Right, Up, Down)
- R: Restart game after game over
- ESC or Q: Quit the game

Requirements:
- Python 3.x
- Pygame library (install with: pip install pygame)

To run: python car_game.py
"""

import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Game Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors (RGB values)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)
GRAY = (128, 128, 128)

# Player car settings
PLAYER_WIDTH = 40
PLAYER_HEIGHT = 60
PLAYER_SPEED = 5

# Obstacle settings
OBSTACLE_WIDTH = 40
OBSTACLE_HEIGHT = 60
OBSTACLE_SPEED = 3
OBSTACLE_SPAWN_RATE = 60  # Lower = more frequent spawning

# Difficulty settings
DIFFICULTY_INCREASE_RATE = 0.001  # How fast the game gets harder


class Player:
    """Player car class - handles the player's car movement and rendering"""
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = PLAYER_WIDTH
        self.height = PLAYER_HEIGHT
        self.speed = PLAYER_SPEED
        
    def move(self, keys):
        """Move the player based on key presses"""
        # Move left (but don't go off screen)
        if keys[pygame.K_LEFT] and self.x > 0:
            self.x -= self.speed
        # Move right (but don't go off screen)
        if keys[pygame.K_RIGHT] and self.x < SCREEN_WIDTH - self.width:
            self.x += self.speed
        # Move up (but don't go off screen)
        if keys[pygame.K_UP] and self.y > 0:
            self.y -= self.speed
        # Move down (but don't go off screen)
        if keys[pygame.K_DOWN] and self.y < SCREEN_HEIGHT - self.height:
            self.y += self.speed
    
    def draw(self, screen):
        """Draw the player car on the screen"""
        # Draw main car body (blue rectangle)
        pygame.draw.rect(screen, BLUE, (self.x, self.y, self.width, self.height))
        # Draw car details (windows and lights)
        pygame.draw.rect(screen, WHITE, (self.x + 5, self.y + 10, self.width - 10, 15))  # Windshield
        pygame.draw.rect(screen, YELLOW, (self.x + 5, self.y + 5, 8, 8))  # Left headlight
        pygame.draw.rect(screen, YELLOW, (self.x + self.width - 13, self.y + 5, 8, 8))  # Right headlight
    
    def get_rect(self):
        """Get the rectangle bounds for collision detection"""
        return pygame.Rect(self.x, self.y, self.width, self.height)


class Obstacle:
    """Obstacle car class - handles enemy cars that move down the screen"""
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = OBSTACLE_WIDTH
        self.height = OBSTACLE_HEIGHT
        self.speed = OBSTACLE_SPEED
        # Random color for variety
        self.color = random.choice([RED, GREEN, YELLOW, GRAY])
    
    def move(self):
        """Move the obstacle down the screen"""
        self.y += self.speed
    
    def draw(self, screen):
        """Draw the obstacle car on the screen"""
        # Draw main car body
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
        # Draw car details
        pygame.draw.rect(screen, WHITE, (self.x + 5, self.y + self.height - 25, self.width - 10, 15))  # Rear window
        pygame.draw.rect(screen, RED, (self.x + 5, self.y + self.height - 5, 8, 8))  # Left taillight
        pygame.draw.rect(screen, RED, (self.x + self.width - 13, self.y + self.height - 5, 8, 8))  # Right taillight
    
    def get_rect(self):
        """Get the rectangle bounds for collision detection"""
        return pygame.Rect(self.x, self.y, self.width, self.height)
    
    def is_off_screen(self):
        """Check if the obstacle has moved off the bottom of the screen"""
        return self.y > SCREEN_HEIGHT


class Game:
    """Main game class - handles game logic, scoring, and game states"""
    
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Surr 2D Car Race")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.big_font = pygame.font.Font(None, 72)
        
        # Game state
        self.running = True
        self.game_over = False
        self.score = 0
        self.spawn_timer = 0
        self.difficulty_multiplier = 1.0
        
        # Create player
        self.player = Player(SCREEN_WIDTH // 2 - PLAYER_WIDTH // 2, SCREEN_HEIGHT - 100)
        
        # List to store obstacles
        self.obstacles = []
    
    def spawn_obstacle(self):
        """Create a new obstacle at a random position at the top of the screen"""
        # Random x position, making sure obstacle fits on screen
        x = random.randint(0, SCREEN_WIDTH - OBSTACLE_WIDTH)
        y = -OBSTACLE_HEIGHT  # Start just above the screen
        self.obstacles.append(Obstacle(x, y))
    
    def update_obstacles(self):
        """Update all obstacles - move them and remove off-screen ones"""
        for obstacle in self.obstacles[:]:  # Use slice copy to safely modify list while iterating
            obstacle.move()
            # Remove obstacles that have moved off screen
            if obstacle.is_off_screen():
                self.obstacles.remove(obstacle)
                self.score += 10  # Increase score for surviving an obstacle
    
    def check_collisions(self):
        """Check if the player has collided with any obstacles"""
        player_rect = self.player.get_rect()
        for obstacle in self.obstacles:
            if player_rect.colliderect(obstacle.get_rect()):
                return True
        return False
    
    def update_difficulty(self):
        """Gradually increase game difficulty over time"""
        self.difficulty_multiplier += DIFFICULTY_INCREASE_RATE
        # Update obstacle speed based on difficulty
        global OBSTACLE_SPEED
        OBSTACLE_SPEED = int(3 * self.difficulty_multiplier)
    
    def draw_road(self):
        """Draw the road background with lane markings"""
        # Fill screen with dark gray (road)
        self.screen.fill((50, 50, 50))
        
        # Draw lane markings (dashed white lines)
        lane_width = SCREEN_WIDTH // 3
        for i in range(1, 3):  # Two lane dividers
            x = lane_width * i
            for y in range(0, SCREEN_HEIGHT, 40):
                pygame.draw.rect(self.screen, WHITE, (x - 2, y, 4, 20))
        
        # Draw road edges
        pygame.draw.rect(self.screen, WHITE, (0, 0, 5, SCREEN_HEIGHT))  # Left edge
        pygame.draw.rect(self.screen, WHITE, (SCREEN_WIDTH - 5, 0, 5, SCREEN_HEIGHT))  # Right edge
    
    def draw_ui(self):
        """Draw the user interface (score, instructions)"""
        # Draw score
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Draw difficulty indicator
        difficulty_text = self.font.render(f"Speed: {OBSTACLE_SPEED}", True, WHITE)
        self.screen.blit(difficulty_text, (10, 50))
        
        # Draw controls hint
        controls_text = self.font.render("Arrow Keys: Move | ESC/Q: Quit", True, WHITE)
        self.screen.blit(controls_text, (10, SCREEN_HEIGHT - 30))
    
    def draw_game_over(self):
        """Draw the game over screen"""
        # Semi-transparent overlay
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.set_alpha(128)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        # Game over text
        game_over_text = self.big_font.render("GAME OVER", True, RED)
        text_rect = game_over_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 50))
        self.screen.blit(game_over_text, text_rect)
        
        # Final score
        final_score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
        score_rect = final_score_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
        self.screen.blit(final_score_text, score_rect)
        
        # Restart instructions
        restart_text = self.font.render("Press R to Restart or ESC to Quit", True, WHITE)
        restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50))
        self.screen.blit(restart_text, restart_rect)
    
    def restart_game(self):
        """Reset the game to initial state"""
        self.game_over = False
        self.score = 0
        self.spawn_timer = 0
        self.difficulty_multiplier = 1.0
        global OBSTACLE_SPEED
        OBSTACLE_SPEED = 3
        
        # Reset player position
        self.player = Player(SCREEN_WIDTH // 2 - PLAYER_WIDTH // 2, SCREEN_HEIGHT - 100)
        
        # Clear all obstacles
        self.obstacles.clear()
    
    def handle_events(self):
        """Handle all pygame events (key presses, window close, etc.)"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE or event.key == pygame.K_q:
                    self.running = False
                elif event.key == pygame.K_r and self.game_over:
                    self.restart_game()
    
    def run(self):
        """Main game loop"""
        print("Starting Surr 2D Car Race!")
        print("Use arrow keys to move, avoid the obstacles!")
        print("Press ESC or Q to quit, R to restart after game over.")
        
        while self.running:
            # Handle events
            self.handle_events()
            
            if not self.game_over:
                # Get current key states for smooth movement
                keys = pygame.key.get_pressed()
                
                # Update player
                self.player.move(keys)
                
                # Spawn obstacles
                self.spawn_timer += 1
                if self.spawn_timer >= OBSTACLE_SPAWN_RATE:
                    self.spawn_obstacle()
                    self.spawn_timer = 0
                
                # Update obstacles
                self.update_obstacles()
                
                # Check for collisions
                if self.check_collisions():
                    self.game_over = True
                    print(f"Game Over! Final Score: {self.score}")
                
                # Update difficulty
                self.update_difficulty()
            
            # Draw everything
            self.draw_road()
            
            if not self.game_over:
                # Draw game objects
                self.player.draw(self.screen)
                for obstacle in self.obstacles:
                    obstacle.draw(self.screen)
                
                # Draw UI
                self.draw_ui()
            else:
                # Draw game over screen
                self.draw_game_over()
            
            # Update display
            pygame.display.flip()
            self.clock.tick(FPS)
        
        # Quit
        pygame.quit()
        sys.exit()


def main():
    """Main function to start the game"""
    try:
        # Create and run the game
        game = Game()
        game.run()
    except pygame.error as e:
        print(f"Pygame error: {e}")
        print("Make sure you have Pygame installed: pip install pygame")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
