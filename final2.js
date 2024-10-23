// Array contendo uma lista de palavras para o jogo
const words = ["limão", "bolsa", "carro", "cabelo", "salame", "verde", "carne", "sapato", "cinema", "computador", "informatica"];

// Variáveis para armazenar o estado atual do jogo
let chosenWord;        // Palavra escolhida aleatoriamente
let displayedWord;     // Palavra exibida ao jogador (com letras adivinhadas e sublinhados)
let remainingAttempts; // Número de tentativas restantes
let guessedLetters;    // Letras que o jogador já tentou

// Adiciona ouvintes de eventos para os botões
document.getElementById('guess-button').addEventListener('click', makeGuess); // Botão para adivinhar letras
document.getElementById('reset-button').addEventListener('click', resetGame); // Botão para reiniciar o jogo

// Adiciona um ouvinte de eventos para a tecla "Enter" no campo de entrada
document.getElementById('letter-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita o comportamento padrão do Enter (como submeter um formulário)
        makeGuess(); // Chama a função de adivinhar letra ao pressionar "Enter"
    }
});

// Função para iniciar ou reiniciar o jogo
function startGame() {
    // Escolhe uma palavra aleatória do array de palavras
    chosenWord = words[Math.floor(Math.random() * words.length)];
    // Inicializa a palavra exibida com sublinhados, um para cada letra da palavra escolhida
    displayedWord = Array(chosenWord.length).fill('_');
    // Define o número inicial de tentativas restantes
    remainingAttempts = 7;
    // Inicializa o array de letras adivinhadas
    guessedLetters = [];

    // Atualiza a exibição do jogo
    updateDisplay();
}

// Função chamada quando o jogador faz uma tentativa de adivinhação
function makeGuess() {
    // Obtém o valor inserido pelo jogador e converte para minúsculas
    const letterInput = document.getElementById('letter-input');
    const letter = letterInput.value.toLowerCase();

    // Verifica se a entrada é uma única letra e se é válida
    if (letter.length !== 1 || !/[a-z]/.test(letter)) {
        document.getElementById('message').textContent = 'Digite uma letra válida!';
        return; // Sai da função se a letra não for válida
    }

    // Verifica se a letra já foi adivinhada anteriormente
    if (guessedLetters.includes(letter)) {
        document.getElementById('message').textContent = 'Você já chutou essa letra!';
        return; // Sai da função se a letra já foi adivinhada
    }

    // Adiciona a letra adivinhada à lista de letras adivinhadas
    guessedLetters.push(letter);

    // Verifica se a letra adivinhada está na palavra escolhida
    if (chosenWord.includes(letter)) {
        // Atualiza a palavra exibida com a letra adivinhada
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                displayedWord[i] = letter;
            }
        }
    } else {
        // Se a letra não estiver na palavra, reduz o número de tentativas restantes
        remainingAttempts--;
    }

    // Atualiza a exibição do jogo
    updateDisplay();

    // Verifica se o jogo terminou
    if (!displayedWord.includes('_')) {
        document.getElementById('message').textContent = 'Parabéns, você ganhou!';
        document.getElementById('guess-button').disabled = true; // Desativa o botão de adivinhar letras
    } else if (remainingAttempts <= 0) {
        document.getElementById('message').textContent = `Você perdeu! A palavra era: ${chosenWord}`;
        document.getElementById('guess-button').disabled = true; // Desativa o botão de adivinhar letras
    }

    // Limpa o campo de entrada de letras
    letterInput.value = '';
}

// Função para atualizar a exibição do jogo
function updateDisplay() {
    // Atualiza o texto que exibe a palavra com as letras adivinhadas
    document.getElementById('word-display').textContent = displayedWord.join(' ');
    // Atualiza o texto que exibe o número de tentativas restantes
    document.getElementById('remaining-attempts').textContent = remainingAttempts;
    // Limpa qualquer mensagem de status
    document.getElementById('message').textContent = '';
}

// Função para reiniciar o jogo
function resetGame() {
    startGame(); // Reinicia o jogo
    document.getElementById('guess-button').disabled = false; // Reativa o botão de adivinhar letras
}

// Inicia o jogo quando a página é carregada
window.onload = startGame;
