let board, ctx, dir, snake, food, score, gameInterval;
let highScore = 0;
const CELL = 10;  // size of each cell in the board

scoreP = document.getElementById("score");
highScoreP = document.getElementById("high-score");

function init() {
    score = 0;
    scoreP.innerHTML = "Score: " + score;
    highScoreP.innerHTML = "High Score: " + highScore;
    board = document.createElement("canvas");
    board.id = "canvas";
    board.width = 600;
    board.height = 600;
    board.style.border = "1px solid black";
    document.getElementById("game-container").appendChild(board);
    ctx = board.getContext("2d");

    dir = "RIGHT";
    food = {};
    generateFood();

    snake = [{x:200, y:300}]; 
    for (let i = 0; i < 5; i++) {
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

    ctx.fillText("Game Over", 300, 300);
    ctx.fillText("Press 'Enter' to start a new game", 270, 350);

    gameInterval = clearInterval(gameInterval);

    if (score > highScore)
        highScore = score;

    document.removeEventListener("keydown", handleArrowKeys);
    document.addEventListener("keydown", handleEnterKey);
}

function newGame() {
    init();
    gameInterval = setInterval(main, 100);
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
        scoreP.innerHTML = "Score: " + score;
        generateFood();
    } else {
        snake.pop();
    }

    drawSnake();
    drawCell(food.x, food.y, "black", "black");

    if (didCollide()) 
        gameOver();
    
}

newGame();
