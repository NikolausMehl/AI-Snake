const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButtonModal');
const endGameModal = document.getElementById('modal');

let snake = [{ x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 }];
let food = { x: 0, y: 0, strength: 0 };
let dx = 20;
let dy = 0;
let score = 0;
let gameOver = false;
let obstacles = [];

function calcDistance(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = segment.x + 'px';
        snakeElement.style.top = segment.y + 'px';
        snakeElement.classList.add('snake');

        let distanceToFood = calcDistance(segment, food);

        if (index === 0) {
            if (distanceToFood <= 5) {
                snakeElement.textContent = '😊';
            } else if (distanceToFood <= 3) {
                snakeElement.textContent = '😄';
            } else if (distanceToFood <= 1) {
                snakeElement.textContent = '😃';
            } else {
                snakeElement.textContent = '😊';
            }
        } else {
            snakeElement.textContent = '🟢';
        }

        gameBoard.appendChild(snakeElement);
    });
}

function addFood() {
    let foodX, foodY;
    let randomValue = Math.random();

    var isCollision = true;
    while (isCollision) {
        foodX = Math.floor(Math.random() * 20) * 20;
        foodY = Math.floor(Math.random() * 20) * 20;
        isCollision = obstacles.some(obstacle => obstacle.x === foodX && obstacle.y === foodY)
            || snake.some(segment => segment.x === foodX && segment.y === foodY);
    }

    food.strength = (randomValue < 0.70) ? 1 : 3; 
    food.x = foodX;
    food.y = foodY;

    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    foodElement.textContent = (food.strength === 1) ? '🐁' : '🐀';

    gameBoard.appendChild(foodElement);
}

function addObstacle() {
    if (score % (Math.floor(Math.random() * 6) + 3) !== 0) return;

    let obstacleX, obstacleY;
    do {
        obstacleX = Math.floor(Math.random() * 20) * 20;
        obstacleY = Math.floor(Math.random() * 20) * 20;
    } while (snake.some(segment => segment.x === obstacleX && segment.y === obstacleY));

    const obstacle = {
        x: obstacleX,
        y: obstacleY,
        type: Math.random() > 0.5 ? '🪨' : '🌲' // Randomly assign rock or tree
    };

    const obstacleElement = document.createElement('div');
    obstacleElement.style.left = obstacle.x + 'px';
    obstacleElement.style.top = obstacle.y + 'px';
    obstacleElement.classList.add('obstacle');
    obstacleElement.textContent = obstacle.type;
    obstacles.push(obstacle);
    gameBoard.appendChild(obstacleElement);
}

function updateSnake() {
    const head = getHead();

    if (checkCollision(head, food)) {
        growSnake(food.strength);
        eatFood();
        addObstacle();
        addFood();
    } else {
        snake.pop();
        snake = [head, ...snake];
    }


    if (obstacles.some(obstacle => checkCollision(head, obstacle))) {
        endGame();
    }

    if (snake.slice(1).some(segment => checkCollision(head, segment))) {
        endGame();
    }

    gameBoard.querySelectorAll('.snake').forEach(element => element.remove());
    gameBoard.querySelectorAll('.obstacle').forEach(element => element.remove());
    obstacles.forEach(obstacle => {
        const obstacleElement = document.createElement('div');
        obstacleElement.style.left = obstacle.x + 'px';
        obstacleElement.style.top = obstacle.y + 'px';
        obstacleElement.classList.add('obstacle');
        obstacleElement.textContent = obstacle.type;
        gameBoard.appendChild(obstacleElement);
    });

    drawSnake();
}

function getHead() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0) head.x = gameBoard.clientWidth - 20;
    if (head.x >= gameBoard.clientWidth) head.x = 0;
    if (head.y < 0) head.y = gameBoard.clientHeight - 20;
    if (head.y >= gameBoard.clientHeight) head.y = 0;
    return head;
}

function growSnake(strength) {
    for (let i = 0; i < strength; i++) {
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    }
}

function checkCollision(position1, position2) {
    const collisionThreshold = 15; // Adjust the collision threshold as needed
    return Math.abs(position1.x - position2.x) < collisionThreshold && Math.abs(position1.y - position2.y) < collisionThreshold;
}

function endGame() {
    gameOver = true;
    document.getElementById('modal').classList.remove('hidden');
}

function eatFood() {
    score += food.strength;
    scoreElement.textContent = score;
    gameBoard.removeChild(document.querySelector('.food'));
}

function startGame() {
    drawSnake();
    addFood();
    mainLoop();
}

function mainLoop() {
    if (gameOver) return;

    let startingSpeed = 200; // Initial speed
    let speedIncrease = 10; // Increase in speed per 5 points earned
    let maxSpeed = 80; // Maximum speed

    let speed = startingSpeed - Math.min(Math.floor(score / 5) * speedIncrease, maxSpeed);

    setTimeout(() => {
        updateSnake();
        mainLoop();
    }, speed);
}

document.addEventListener('keydown', e => {
    handleKeyPress(e.key);
});

// Add touch event listeners
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

document.addEventListener('touchmove', e => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) handleKeyPress('ArrowRight');
        else handleKeyPress('ArrowLeft');
    } else {
        if (dy > 0) handleKeyPress('ArrowDown');
        else handleKeyPress('ArrowUp');
    }

    touchStartX = 0;
    touchStartY = 0;
});

function handleKeyPress(key) {
    switch (key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -20;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 20;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -20;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 20;
                dy = 0;
            }
            break;
    }
}

function restartGame() {
    snake = [{ x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 }];
    obstacles = [];
    dx = 20;
    dy = 0;
    score = 0;
    gameOver = false;
    scoreElement.textContent = score;
    gameBoard.querySelectorAll('.snake').forEach(element => element.remove());
    gameBoard.querySelectorAll('.food').forEach(element => element.remove());
    gameBoard.querySelectorAll('.obstacle').forEach(element => element.remove());
    startGame();
}

restartButton.addEventListener('click', () => {
    endGameModal.classList.add('hidden');
    restartGame();
});

startGame(); 