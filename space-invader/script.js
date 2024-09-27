// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
const playerSize = 50;
const enemySize = 50;
const bulletSize = 10;

// Player
let playerX = canvas.width / 2;
let playerY = canvas.height - playerSize;
let playerSpeed = 5;

// Enemies
const enemyCount = 10;
let enemies = [];
for (let i = 0; i < enemyCount; i++) {
    enemies.push({
        x: 50 + (i * enemySize),
        y: 50
    });
}

// Bullets
let playerBullets = [];

// Game loop
function update() {
    // Move player
    if (leftPressed) {
        playerX -= playerSpeed;
    }
    if (rightPressed) {
        playerX += playerSpeed;
    }

    // Move enemies
    if (enemies[0].x < 50) {
        for (let enemy of enemies) {
            enemy.y += 2;
        }
    } else if (enemies[0].x > canvas.width - enemySize - 50) {
        for (let enemy of enemies) {
            enemy.y += 2;
        }
    } else {
        for (let enemy of enemies) {
            if (Math.random() < 0.1) {
                enemy.x -= 2;
            } else {
                enemy.x += 2;
            }
        }
    }

    // Move bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= 5;
        if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
        }
    }

    // Check collisions
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(playerBullets[i], enemies[j])) {
                playerBullets.splice(i, 1);
                enemies.splice(j, 1);
            }
        }
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
    for (let enemy of enemies) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
    }
    for (let bullet of playerBullets) {
        ctx.fillStyle = 'green';
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }
}

// Handle key presses
let leftPressed = false;
let rightPressed = false;
document.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
        leftPressed = true;
    } else if (event.keyCode === 39) {
        rightPressed = true;
    } else if (event.keyCode === 32) {
        playerBullets.push({
            x: playerX + (playerSize / 2),
            y: playerY
        });
    }
});
document.addEventListener('keyup', (event) => {
    if (event.keyCode === 37) {
        leftPressed = false;
    } else if (event.keyCode === 39) {
        rightPressed = false;
    }
});

// Check for collisions
function checkCollision(rect1, rect2) {
    if (rect1.x < rect2.x + enemySize &&
        rect1.x + bulletSize > rect2.x &&
        rect1.y < rect2.y + enemySize &&
        rect1.height + rect1.y > rect2.y) {
        return true;
    }
    return false;
}

// Start the game loop
setInterval(update, 1000 / 60);
