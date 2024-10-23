const mazeContainer = document.getElementById('maze');
const timerDisplay = document.getElementById('time-left');
const gameOverScreen = document.getElementById('game-over');
let completedMazesDisplay = document.createElement('p'); // Exibe o número de labirintos completados
gameOverScreen.appendChild(completedMazesDisplay);

let maze = [];
let playerPosition = { x: 1, y: 1 };
let timeLeft = 60; // Tempo inicial
let timer;
let completedMazes = 0; // Contador de labirintos completados

// Função para gerar o labirinto
function generateMaze(rows, cols) {
    maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    function carvePath(x, y) {
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        directions.sort(() => Math.random() - 0.5);
        for (let [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[y + dy][x + dx] = 0;
                carvePath(nx, ny);
            }
        }
    }
    maze[1][1] = 0;
    carvePath(1, 1);
    maze[rows - 2][cols - 2] = 0;
}

// Função para desenhar o labirinto
function drawMaze() {
    mazeContainer.innerHTML = '';
    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (maze[r][c] === 1) {
                cell.classList.add('wall');
            } else if (r === playerPosition.y && c === playerPosition.x) {
                cell.classList.add('player');
            } else if (r === maze.length - 2 && c === maze[0].length - 2) {
                cell.classList.add('exit');
            }
            mazeContainer.appendChild(cell);
        }
    }
}

// Função para mover o jogador
function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    if (maze[newY] && maze[newY][newX] === 0) {
        playerPosition.x = newX;
        playerPosition.y = newY;

        // Gira o jogador de acordo com a tecla pressionada
        const playerElement = document.querySelector('.player');
        if (dy === -1) {
            playerElement.style.backgroundImage = "url('macacocima.png')"; // Imagem do macaco olhando para cima
        } else if (dy === 1) {
            playerElement.style.backgroundImage = "url('macaco.png')"; // Imagem do macaco olhando para baixo
        } else if (dx === 1) {
            playerElement.style.backgroundImage = "url('macacodireita.png')"; // Imagem do macaco olhando para a direita
        } else if (dx === -1) {
            playerElement.style.backgroundImage = "url('macacoesquerda.png')"; // Imagem do macaco olhando para a esquerda
        }

        // Checa se o jogador chegou à saída
        if (newX === maze[0].length - 2 && newY === maze.length - 2) {
            completedMazes++; // Incrementa o contador de labirintos completados
            generateMaze(15, 20); // Gera um novo labirinto
            playerPosition = { x: 1, y: 1 }; // Reseta a posição do jogador
        }
        
        drawMaze(); // Desenha o labirinto (incluindo a nova posição do jogador)
    }
}

// Função para reiniciar o jogo
function resetGame() {
    playerPosition = { x: 1, y: 1 };
    timeLeft = 60;
    completedMazes = 0; // Reseta o contador de labirintos
    gameOverScreen.classList.add('hidden');
    gameOverScreen.classList.remove('show'); // Remove a classe 'show' caso o game over tenha sido exibido antes
    startGame();
}

// Função que atualiza o timer a cada segundo
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft; // Atualiza o texto exibido do tempo
    
    if (timeLeft <= 0) {
        clearInterval(timer); // Para o timer
        gameOver(); // Chama a função de game over
    }
}

// Função que exibe a tela de Game Over
function gameOver() {
    clearInterval(timer); // Para o cronômetro
    gameOverScreen.classList.remove('hidden'); // Remove a classe que esconde o game over
    gameOverScreen.classList.add('show'); // Adiciona a classe que exibe o game over
    completedMazesDisplay.textContent = `Você completou ${completedMazes} labirintos!`; // Mostra a quantidade de labirintos completados
}

// Função que inicia o jogo a partir da tela inicial
function startGame() {
    document.getElementById('start-screen').classList.add('hidden'); // Esconde a tela de início
    document.getElementById('game-container').classList.remove('hidden'); // Exibe o contêiner do jogo
    generateMaze(15, 20); // Gera o labirinto inicial
    drawMaze(); // Desenha o labirinto inicial
    timer = setInterval(updateTimer, 1000); // Inicia o timer
    timerDisplay.textContent = timeLeft; // Exibe o tempo restante
}

// Evento para iniciar o jogo quando o botão "Iniciar Jogo" for clicado
document.getElementById('start-button').addEventListener('click', startGame);

// Função para exibir a tela inicial
function showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden'); // Exibe a tela de início
}

// Eventos de tecla
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1); // Mover para cima
            break;
        case 'ArrowDown':
            movePlayer(0, 1); // Mover para baixo
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0); // Mover para a esquerda
            break;
        case 'ArrowRight':
            movePlayer(1, 0); // Mover para a direita
            break;
        case 'r': // Tecla R para reiniciar o jogo
            resetGame();
            break;
    }
});

// Exibe a tela inicial ao carregar a página
window.onload = showStartScreen;
