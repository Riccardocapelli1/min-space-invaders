// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
const playerCarSize = 50;
const opponentCarSize = 50;
const playerCarSpeed = 5;
const opponentCarSpeed = 2;

// Player car
let playerCarX = canvas.width / 2;
let playerCarY = canvas.height - playerCarSize;

// Opponent cars
const opponentCars = [];
for (let i = 0; i < 10; i++) {
    opponentCars.push({
        x: Math.random() * (canvas.width - opponentCarSize),
        y: Math.random() * (canvas.height / 2),
    });
}

// Game loop
function update() {
    // Move player car
    if (leftPressed) {
        playerCarX -= playerCarSpeed;
    }
    if (rightPressed) {
        playerCarX += playerCarSpeed;
    }

    // Move opponent cars
    for (let i = opponentCars.length - 1; i >= 0; i--) {
        opponentCars[i].y += opponentCarSpeed;
        if (opponentCars[i].y > canvas.height) {
            opponentCars.splice(i, 1);
        }
    }

    // Check collisions
    for (let i = opponentCars.length - 1; i >= 0; i--) {
        if (checkCollision(playerCarX, playerCarY, opponentCars[i].x, opponentCars[i].y)) {
            playerCarX = canvas.width / 2;
            playerCarY = canvas.height - playerCarSize;
        }
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(playerCarX, playerCarY, playerCarSize, playerCarSize);
    for (let i = 0; i < opponentCars.length; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(opponentCars[i].x, opponentCars[i].y, opponentCarSize, opponentCarSize);
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
function checkCollision(x1, y1, x2, y2) {
    if (x1 < x2 + opponentCarSize &&
        x1 + playerCarSize > x2 &&
        y1 < y2 + opponentCarSize &&
        y1 + playerCarSize > y2) {
        return true;
    }
    return false;
}

// Start the game loop
setInterval(update, 1000 / 60);
