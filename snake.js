const board = document.getElementById("canvas");
const ctx = board.getContext("2d");
board.width = 600;
board.height = 600;
board.style.border = "1px solid black";

let playing = true;
let dir = "RIGHT";
const CELL = 10;  // size of each cell in the board

let snake = [{x:200, y:300}]; 
let food = {};

generateFood();

// initialize snake 
for (let i = 0; i < 5; i++) {
    let newx = snake[i].x - CELL;
    let newy = snake[i].y;
    snake.push({x: newx, y: newy});
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            if (dir != "RIGHT") dir = "LEFT";
            break;
        case "ArrowRight":
            if (dir != "LEFT") dir = "RIGHT";
            break;
        case "ArrowUp":
            if (dir != "DOWN") dir = "UP";
            break;
        case "ArrowDown":
            if (dir != "UP") dir = "DOWN";
            break;
    }
});

function drawCell(x, y, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.fillRect(x, y, CELL, CELL);
    ctx.strokeRect(x, y, CELL, CELL);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        drawCell(snake[i].x, snake[i].y, "yellow", "black");
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, board.width, board.height);
}

function moveSnake(dx, dy) {
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);
}

function didEat() {
    return snake[0].x == food.x && snake[0].y == food.y;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 60) * CELL,
        y: Math.floor(Math.random() * 60) * CELL
    }
}

function didCollide() {
    // Check bounds of the board
    if (snake[0].x >= board.width || snake[0].x <= 0 ||
        snake[0].y >= board.height || snake[0].y <= 0) {
        return true;
    }
    // Check collision with snake
    for (let i = 2; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    ctx.clearRect(0, 0, board.width, board.height);
    ctx.fillText("Game Over", 200, 250);
    gameInterval = clearInterval(gameInterval);
}

function main() {
    clearBoard();

    let dx = 0;
    let dy = 0;
    if (dir === "LEFT") dx -= CELL;
    if (dir === "RIGHT") dx += CELL;
    if (dir === "UP") dy -= CELL;
    if (dir === "DOWN") dy += CELL;
    moveSnake(dx, dy);
    
    if (didEat()) {  
        generateFood();
    } else {
        snake.pop();
    }

    // Draw snake and food
    drawSnake();
    drawCell(food.x, food.y, "black", "black");

    if (didCollide()) {
        gameOver();
    }
}

let gameInterval = setInterval(main, 100);
