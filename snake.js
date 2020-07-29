let board, ctx, dir, snake, food, score, gameInterval;
let highScore = 0;
const CELL = 10;  // size of each cell in the board

scoreP = document.getElementById("score");
highScoreP = document.getElementById("high-score");

function init() {
    score = 0;
    board = document.createElement("canvas");
    board.id = "canvas";

    // The math gets rid of the pixels in ones place so the snake stays mostly on screen
    board.width = Math.floor(window.innerWidth / CELL) * CELL;
    board.height = Math.floor(window.innerHeight / CELL) * CELL;

    board.style.border = "1px solid black";
    document.getElementById("game-container").appendChild(board);
    ctx = board.getContext("2d");

    drawScores();

    dir = "RIGHT";
    food = {};
    generateFood();

    snake = [{x:200, y:300}]; 
    for (let i = 0; i < 10; i++) {
        let newx = snake[i].x - CELL;
        let newy = snake[i].y;
        snake.push({x: newx, y: newy});
    }

    // Remove the "enter" event listener so you can't start a new game before losing
    document.removeEventListener("keydown", handleEnterKey);
    document.addEventListener("keydown", handleArrowKeys);
}

// Change direction on keypress. Prevent movement in opposite direction.
function handleArrowKeys(event) {
    event.preventDefault();
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
}

function handleEnterKey(event) {
    if (event.key == "Enter") {
        board.remove();
        board = null;
        newGame();
    }
}

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

function drawScores() {
    ctx.font = "16px sans-serif";
    ctx.fillText("Score: " + score, 20, 20);
    ctx.fillText("High Score: " + highScore, 20, 50);
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

function generateFood() {
    food = {
        x: Math.floor(Math.random() * board.width / CELL) * CELL,
        y: Math.floor(Math.random() * board.height / CELL) * CELL
    }
}

function didEat() {
    return snake[0].x == food.x && snake[0].y == food.y;
}

function didCollide() {
    // Check bounds of the board
    if (snake[0].x >= board.width || snake[0].x < 0 ||
        snake[0].y >= board.height || snake[0].y < 0) {
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
    clearBoard();

    drawScores();
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    // This prints off center. I might fix it later
    ctx.fillText("Game Over", centerX, centerY);
    ctx.fillText("Press 'Enter' to start a new game", centerX, centerY + 50);

    gameInterval = clearInterval(gameInterval); // = undefined

    if (score > highScore)
        highScore = score;

    // There's no real reason to remove this listener, but whatever.
    document.removeEventListener("keydown", handleArrowKeys);
    document.addEventListener("keydown", handleEnterKey);
}

function newGame() {
    init();
    gameInterval = setInterval(main, 70); // determines snake speed
}

function main() {
    clearBoard();

    // Check for new direction
    let dx = 0;
    let dy = 0;
    if (dir === "LEFT") dx -= CELL;
    if (dir === "RIGHT") dx += CELL;
    if (dir === "UP") dy -= CELL;
    if (dir === "DOWN") dy += CELL;
    moveSnake(dx, dy);
    
    if (didEat()) {  
        ++score;
        generateFood();
    } else {
        snake.pop();
    }

    drawScores();

    drawSnake();
    drawCell(food.x, food.y, "black", "black");

    if (didCollide()) 
        gameOver();
}

newGame();
