import pygame
import sys
import random

# Game Variables
screen_width = 800
screen_height = 600
bg_color = (0, 0, 0)
player_size = 50
enemy_size = 50
bullet_size = 10

class Player(pygame.Rect):
    def __init__(self):
        super().__init__(screen_width / 2, screen_height - player_size, player_size, player_size)
        self.speed = 5

    def move(self, direction):
        if direction == 'left' and self.left > 0:
            self.x -= self.speed
        elif direction == 'right' and self.right < screen_width:
            self.x += self.speed

class Enemy(pygame.Rect):
    def __init__(self, x, y):
        super().__init__(x, y, enemy_size, enemy_size)
        self.speed = 2

    def move(self, direction):
        if direction == 'down':
            self.y += self.speed
        elif direction == 'left':
            self.x -= self.speed
        elif direction == 'right':
            self.x += self.speed

class Bullet(pygame.Rect):
    def __init__(self, x, y):
        super().__init__(x, y, bullet_size, bullet_size)
        self.speed = 5

    def move(self, direction):
        if direction == 'up':
            self.y -= self.speed
        elif direction == 'down':
            self.y += self.speed

def main():
    pygame.init()
    clock = pygame.time.Clock()
    screen = pygame.display.set_mode((screen_width, screen_height))
    font = pygame.font.Font(None, 36)

    while True:
        player = Player()
        enemies = [Enemy(50 + i * enemy_size, 50) for i in range(10)]
        player_bullets = []
        enemy_bullets = []
        enemy_shoot_cooldown = 0

        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        player_bullets.append(Bullet(player.centerx, player.top))

            keys = pygame.key.get_pressed()
            if keys[pygame.K_LEFT]:
                player.move('left')
            if keys[pygame.K_RIGHT]:
                player.move('right')

            # Move enemies
            for enemy in enemies:
                if enemy.x < 50:
                    for e in enemies:
                        e.move('down')
                    break
                elif enemy.x > screen_width - enemy_size - 50:
                    for e in enemies:
                        e.move('down')
                    break
                else:
                    if random.random() < 0.1:
                        enemy.move('left')
                    else:
                        enemy.move('right')

            # Shoot enemy bullets
            if enemy_shoot_cooldown > 0:
                enemy_shoot_cooldown -= 1
            else:
                enemy_shoot_cooldown = 100
                enemy = random.choice(enemies)
                enemy_bullets.append(Bullet(enemy.centerx, enemy.bottom))

            # Move bullets
            for bullet in player_bullets[:]:
                bullet.move('up')
                if bullet.bottom < 0:
                    player_bullets.remove(bullet)
            for bullet in enemy_bullets[:]:
                bullet.move('down')
                if bullet.top > screen_height:
                    enemy_bullets.remove(bullet)

            # Check collisions
            for bullet in player_bullets[:]:
                for enemy in enemies[:]:
                    if bullet.colliderect(enemy):
                        if bullet in player_bullets:
                            player_bullets.remove(bullet)
                        if enemy in enemies:
                            enemies.remove(enemy)
            for bullet in enemy_bullets[:]:
                if bullet.colliderect(player):
                    if bullet in enemy_bullets:
                        enemy_bullets.remove(bullet)

            # Check for level completion
            if not enemies:
                break

            # Draw everything
            screen.fill(bg_color)
            pygame.draw.rect(screen, (255, 255, 255), player)
            for enemy in enemies:
                pygame.draw.rect(screen, (255, 0, 0), enemy)
            for bullet in player_bullets:
                pygame.draw.rect(screen, (0, 255, 0), bullet)
            for bullet in enemy_bullets:
                pygame.draw.rect(screen, (0, 0, 255), bullet)

            pygame.display.flip()
            clock.tick(60)

        # Draw level completion screen
        screen.fill(bg_color)
        text = font.render("Level Complete!", True, (255, 255, 255))
        text_rect = text.get_rect(center=(screen_width / 2, screen_height / 2))
        screen.blit(text, text_rect)
        text = font.render("Press 'N' for new game or 'E' to exit", True, (255, 255, 255))
        text_rect = text.get_rect(center=(screen_width / 2, screen_height / 2 + 50))
        screen.blit(text, text_rect)

        pygame.display.flip()
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_n:
                        waiting = False
                    elif event.key == pygame.K_e:
                        pygame.quit()
                        sys.exit()

if __name__ == "__main__":
    main()
