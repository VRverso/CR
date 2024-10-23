const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const finalTimeDisplay = document.getElementById('finalTime');

let score = 0;
let lives = 3;
let timer = 0;
let gameInterval;
let cowInterval;
let cows = [];
const cowboy = document.getElementById('cowboy');
const cowboySpeed = 5;
const bulletSpeed = 8;
const cowSpeed = 6;

let cowboyPosition = window.innerWidth / 2 - 30;
cowboy.style.left = `${cowboyPosition}px`;

let moveLeft = false;
let moveRight = false;

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    lives = 3;
    timer = 0;
    cows = [];
    scoreDisplay.innerText = `Score: ${score}`;
    livesDisplay.innerText = `Vidas: ${lives}`;
    timerDisplay.innerText = `Tempo: ${timer}`;
    
    document.getElementById('startScreen').style.display = 'none'; // Escondendo a tela inicial
    gameArea.style.display = 'block'; // Mostrar área do jogo
    
    gameInterval = setInterval(updateTimer, 1000);
    cowInterval = setInterval(generateCow, 500);
    document.addEventListener('keydown', moveCowboy);
    document.addEventListener('keyup', stopCowboy);

    setInterval(updateGameObjects, 16); // Aproximadamente 60 FPS
}

function updateTimer() {
    timer++;
    timerDisplay.innerText = `Tempo: ${timer}`;
}

function moveCowboy(event) {
    const maxLeft = window.innerWidth - 60;
    if (event.key === 'ArrowLeft') {
        moveLeft = true;
    } else if (event.key === 'ArrowRight') {
        moveRight = true;
    } else if (event.key === ' ') {
        shoot();
    }
}

function stopCowboy(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        moveRight = false;
    }
}

function updateCowboyPosition() {
    const maxLeft = window.innerWidth - 60;
    if (moveLeft && cowboyPosition > 0) {
        cowboyPosition -= cowboySpeed;
    }
    if (moveRight && cowboyPosition < maxLeft) {
        cowboyPosition += cowboySpeed;
    }
    cowboy.style.left = `${cowboyPosition}px`;
}

function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.position = 'absolute';

    // Centralizando o tiro em relação ao cowboy
    const cowboyRect = cowboy.getBoundingClientRect();
    bullet.style.left = `${cowboyRect.left + (cowboyRect.width / 2) - (30 / 2)}px`; // 30 é a largura do tiro
    bullet.style.bottom = '110px'; // Distância do fundo
    gameArea.appendChild(bullet);
    
    const bulletInterval = setInterval(() => {
        const bulletRect = bullet.getBoundingClientRect();
        bullet.style.bottom = `${parseInt(bullet.style.bottom) + bulletSpeed}px`;

        if (bulletRect.top < 0) { // Corrigido para não sumir
            clearInterval(bulletInterval);
            bullet.remove();
        }

        cows.forEach((cow, index) => {
            const cowRect = cow.getBoundingClientRect();
            if (isColliding(bulletRect, cowRect)) {
                score += 10;
                scoreDisplay.innerText = `Score: ${score}`;
                createExplosion(cowRect.left, cowRect.top, 'enemy');
                clearInterval(bulletInterval);
                bullet.remove();
                cow.remove();
                cows.splice(index, 1);
            }
        });
    }, 16);
}

function generateCow() {
    if (cows.length < 5) {
        const cow = document.createElement('div');
        cow.classList.add('cow');
        cow.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
        cow.style.top = '-100px'; // Começar acima da tela
        gameArea.appendChild(cow);
        cows.push(cow);
    }
}

function updateGameObjects() {
    updateCowMovement();
    updateCowboyPosition();
}

function updateCowMovement() {
    cows.forEach((cow, index) => {
        cow.style.top = `${parseInt(cow.style.top) + cowSpeed}px`;

        if (parseInt(cow.style.top) > window.innerHeight) {
            cow.remove();
            cows.splice(index, 1);
        }

        const cowboyRect = cowboy.getBoundingClientRect();
        if (isColliding(cow.getBoundingClientRect(), cowboyRect)) {
            lives--;
            livesDisplay.innerText = `Vidas: ${lives}`;
            // Ajuste a posição da explosão para ficar acima do personagem
            createExplosion(cowboyRect.left + (cowboyRect.width / 2) - 35, cowboyRect.top - 100, 'player');
            cow.remove();
            cows.splice(index, 1);

            if (lives <= 0) {
                clearInterval(gameInterval);
                clearInterval(cowInterval);
                startButton.style.display = 'block'; 
                document.removeEventListener('keydown', moveCowboy);
                document.removeEventListener('keyup', stopCowboy);

                finalScoreDisplay.innerText = `Pontuação Final: ${score}`;
                finalTimeDisplay.innerText = `Tempo: ${timer} segundos`;
                gameOverScreen.style.display = 'flex';
            }
        }
    });
}

function isColliding(rect1, rect2) {
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

function createExplosion(x, y, type) {
    const explosion = document.createElement('div');
    if (type === 'player') {
        explosion.classList.add('explosion-player');
    } else {
        explosion.classList.add('explosion-enemy');
    }
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameArea.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 500);
}
