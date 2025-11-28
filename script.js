// Elementos do DOM
const heartsContainer = document.getElementById('heartsContainer');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const successOverlay = document.getElementById('successOverlay');
const heartExplosion = document.getElementById('heartExplosion');
const gamesOverlay = document.getElementById('gamesOverlay');
const gameArea = document.getElementById('gameArea');
const winsCountEl = document.getElementById('winsCount');
const currentGameEl = document.getElementById('currentGame');
const failOverlay = document.getElementById('failOverlay');
const finalWinsEl = document.getElementById('finalWins');
const btnRetry = document.getElementById('btnRetry');

// Emojis de corações para usar
const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '🩷', '💜', '🧡'];

// Estado dos jogos
let gameState = {
    currentGame: 0,
    wins: 0,
    totalGames: 12,
    requiredWins: 8
};

// Lista de jogos em ordem aleatória
let gameOrder = [];

// ============================================
// CORAÇÕES CAINDO (código original)
// ============================================

function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    const size = Math.random() * 20 + 15;
    heart.style.fontSize = size + 'px';
    const duration = Math.random() * 3 + 4;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + 2) * 1000);
}

setInterval(createFallingHeart, 300);
for (let i = 0; i < 10; i++) {
    setTimeout(createFallingHeart, i * 200);
}

// ============================================
// BOTÃO NÃO - FOGE DO MOUSE
// ============================================

function moveNoButton(e) {
    const button = btnNo;
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const padding = 20;
    const maxX = cardRect.width - button.offsetWidth - padding;
    const maxY = cardRect.height - button.offsetHeight - padding;
    let newX = Math.random() * maxX;
    let newY = Math.random() * (maxY / 2) + cardRect.height / 2;
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(cardRect.height / 2, Math.min(newY, maxY + 100));
    button.style.position = 'absolute';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.transition = 'all 0.2s ease';
    const currentScale = parseFloat(btnYes.dataset.scale) || 1;
    const newScale = Math.min(currentScale + 0.1, 1.5);
    btnYes.dataset.scale = newScale;
    btnYes.style.transform = `scale(${newScale})`;
}

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton(e);
}, { passive: false });
btnNo.addEventListener('click', function(e) {
    e.preventDefault();
    moveNoButton(e);
});

// ============================================
// BOTÃO SIM - INICIA OS MINIJOGOS
// ============================================

btnYes.addEventListener('click', function() {
    startMiniGames();
});

btnYes.addEventListener('touchstart', function() {
    this.style.transform = 'scale(1.05)';
});

btnYes.addEventListener('touchend', function() {
    const scale = parseFloat(this.dataset.scale) || 1;
    this.style.transform = `scale(${scale})`;
});

// Botão tentar novamente
btnRetry.addEventListener('click', function() {
    failOverlay.classList.remove('show');
    startMiniGames();
});

// ============================================
// SISTEMA DE MINIJOGOS
// ============================================

function startMiniGames() {
    // Resetar estado
    gameState.currentGame = 0;
    gameState.wins = 0;

    // Embaralhar ordem dos jogos
    gameOrder = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    // Atualizar UI
    updateGameUI();

    // Mostrar overlay dos jogos
    gamesOverlay.classList.add('show');

    // Iniciar primeiro jogo
    showGameIntro(gameOrder[0]);
}

function updateGameUI() {
    winsCountEl.textContent = gameState.wins;
    currentGameEl.textContent = gameState.currentGame + 1;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showGameIntro(gameIndex) {
    const games = [
        { name: "Jogo da Memória", desc: "Encontre todos os 6 pares de cartas em 45 segundos!" },
        { name: "Simon Says", desc: "Memorize e repita a sequência de 5 cores!" },
        { name: "Matemática Rápida", desc: "Resolva 3 contas em 8 segundos cada!" },
        { name: "Digitação Veloz", desc: "Digite a palavra corretamente em 6 segundos!" },
        { name: "Acerte os Corações", desc: "Clique em 10 corações em 12 segundos!" },
        { name: "Puzzle Deslizante", desc: "Organize os números de 1 a 8 em 45 segundos!" },
        { name: "Reflexo Rápido", desc: "Clique quando a caixa ficar VERDE em menos de 400ms!" },
        { name: "Encontre o Diferente", desc: "Ache o emoji diferente 3 vezes!" },
        { name: "Labirinto", desc: "Leve o coração até o destino em 25 segundos!" },
        { name: "Complete a Sequência", desc: "Descubra o próximo número 3 vezes!" },
        { name: "Quiz do Amor", desc: "Acerte 3 perguntas sobre relacionamentos!" },
        { name: "Timing Perfeito", desc: "Pare a barra na zona verde 3 de 5 vezes!" }
    ];

    const game = games[gameIndex];

    gameArea.innerHTML = `
        <h3 class="game-title">${game.name}</h3>
        <p class="game-instructions">${game.desc}</p>
        <button class="btn-start-game" onclick="startGame(${gameIndex})">Começar!</button>
    `;
}

function startGame(gameIndex) {
    switch(gameIndex) {
        case 0: startMemoryGame(); break;
        case 1: startSimonGame(); break;
        case 2: startMathGame(); break;
        case 3: startTypingGame(); break;
        case 4: startCatchGame(); break;
        case 5: startPuzzleGame(); break;
        case 6: startReactionGame(); break;
        case 7: startDifferentGame(); break;
        case 8: startMazeGame(); break;
        case 9: startSequenceGame(); break;
        case 10: startQuizGame(); break;
        case 11: startTimingGame(); break;
    }
}

function endGame(won) {
    if (won) gameState.wins++;
    gameState.currentGame++;
    updateGameUI();

    // Verificar se acabou
    if (gameState.currentGame >= gameState.totalGames) {
        // Fim dos jogos
        setTimeout(() => {
            gamesOverlay.classList.remove('show');
            if (gameState.wins >= gameState.requiredWins) {
                showSuccess();
            } else {
                showFailure();
            }
        }, 1500);
        return;
    }

    // Verificar se já é impossível ganhar
    const remainingGames = gameState.totalGames - gameState.currentGame;
    const maxPossibleWins = gameState.wins + remainingGames;
    if (maxPossibleWins < gameState.requiredWins) {
        setTimeout(() => {
            gamesOverlay.classList.remove('show');
            showFailure();
        }, 1500);
        return;
    }

    // Mostrar resultado e próximo jogo
    const resultClass = won ? 'win' : 'lose';
    const resultText = won ? 'Você venceu! 🎉' : 'Você perdeu! 😢';

    gameArea.innerHTML = `
        <div class="game-result ${resultClass}">
            <h3>${resultText}</h3>
            <p>Vitórias: ${gameState.wins}/${gameState.requiredWins} necessárias</p>
            <button class="btn-next-game" onclick="showGameIntro(gameOrder[${gameState.currentGame}])">
                Próximo Jogo
            </button>
        </div>
    `;
}

function showSuccess() {
    successOverlay.classList.add('show');
    createHeartExplosion();
    setInterval(createHeartExplosion, 2000);
}

function showFailure() {
    finalWinsEl.textContent = gameState.wins;
    failOverlay.classList.add('show');
}

// ============================================
// JOGO 1: MEMÓRIA
// ============================================

let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryLocked = false;
let memoryTimer = null;
let memoryTimeLeft = 45;

function startMemoryGame() {
    const emojis = ['🌹', '💎', '🦋', '🌙', '⭐', '🔥'];
    const pairs = [...emojis, ...emojis];
    memoryCards = shuffleArray(pairs);
    memoryFlipped = [];
    memoryMatched = 0;
    memoryLocked = false;
    memoryTimeLeft = 45;

    let html = `
        <div class="game-timer">⏱️ <span id="memoryTime">${memoryTimeLeft}</span>s</div>
        <div class="memory-grid">
    `;

    memoryCards.forEach((emoji, index) => {
        html += `<div class="memory-card" data-index="${index}" onclick="flipMemoryCard(${index})"></div>`;
    });

    html += '</div>';
    gameArea.innerHTML = html;

    memoryTimer = setInterval(() => {
        memoryTimeLeft--;
        document.getElementById('memoryTime').textContent = memoryTimeLeft;
        if (memoryTimeLeft <= 0) {
            clearInterval(memoryTimer);
            endGame(false);
        }
    }, 1000);
}

function flipMemoryCard(index) {
    if (memoryLocked) return;
    const card = document.querySelector(`.memory-card[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = memoryCards[index];
    memoryFlipped.push({ index, card });

    if (memoryFlipped.length === 2) {
        memoryLocked = true;
        const [first, second] = memoryFlipped;

        if (memoryCards[first.index] === memoryCards[second.index]) {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            memoryMatched++;
            memoryFlipped = [];
            memoryLocked = false;

            if (memoryMatched === 6) {
                clearInterval(memoryTimer);
                endGame(true);
            }
        } else {
            setTimeout(() => {
                first.card.classList.remove('flipped');
                first.card.textContent = '';
                second.card.classList.remove('flipped');
                second.card.textContent = '';
                memoryFlipped = [];
                memoryLocked = false;
            }, 800);
        }
    }
}

// ============================================
// JOGO 2: SIMON SAYS
// ============================================

let simonSequence = [];
let simonPlayerSequence = [];
let simonLevel = 0;
let simonPlaying = false;

function startSimonGame() {
    simonSequence = [];
    simonPlayerSequence = [];
    simonLevel = 0;
    simonPlaying = false;

    gameArea.innerHTML = `
        <p class="simon-level">Memorize a sequência!</p>
        <div class="simon-container">
            <button class="simon-btn red" data-color="red" onclick="simonPress('red')"></button>
            <button class="simon-btn blue" data-color="blue" onclick="simonPress('blue')"></button>
            <button class="simon-btn green" data-color="green" onclick="simonPress('green')"></button>
            <button class="simon-btn yellow" data-color="yellow" onclick="simonPress('yellow')"></button>
        </div>
    `;

    setTimeout(simonNextLevel, 1000);
}

function simonNextLevel() {
    simonLevel++;
    simonPlayerSequence = [];
    const colors = ['red', 'blue', 'green', 'yellow'];
    simonSequence.push(colors[Math.floor(Math.random() * 4)]);

    document.querySelector('.simon-level').textContent = `Nível ${simonLevel}/5 - Observe!`;
    simonPlaying = false;

    simonPlaySequence();
}

function simonPlaySequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= simonSequence.length) {
            clearInterval(interval);
            simonPlaying = true;
            document.querySelector('.simon-level').textContent = `Nível ${simonLevel}/5 - Sua vez!`;
            return;
        }
        simonFlash(simonSequence[i]);
        i++;
    }, 600);
}

function simonFlash(color) {
    const btn = document.querySelector(`.simon-btn.${color}`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 400);
}

function simonPress(color) {
    if (!simonPlaying) return;

    simonFlash(color);
    simonPlayerSequence.push(color);

    const currentIndex = simonPlayerSequence.length - 1;
    if (simonPlayerSequence[currentIndex] !== simonSequence[currentIndex]) {
        endGame(false);
        return;
    }

    if (simonPlayerSequence.length === simonSequence.length) {
        if (simonLevel >= 5) {
            endGame(true);
        } else {
            document.querySelector('.simon-level').textContent = 'Correto! Próximo nível...';
            setTimeout(simonNextLevel, 1000);
        }
    }
}

// ============================================
// JOGO 3: MATEMÁTICA RÁPIDA
// ============================================

let mathCorrect = 0;
let mathTotal = 3;
let mathAnswer = 0;
let mathTimer = null;
let mathTimeLeft = 8;

function startMathGame() {
    mathCorrect = 0;
    showMathProblem();
}

function showMathProblem() {
    if (mathCorrect >= mathTotal) {
        endGame(true);
        return;
    }

    mathTimeLeft = 8;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * 3)];
    let a, b;

    if (op === '*') {
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
    } else if (op === '-') {
        a = Math.floor(Math.random() * 40) + 20;
        b = Math.floor(Math.random() * 20) + 1;
    } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
    }

    mathAnswer = eval(`${a} ${op} ${b}`);
    const opDisplay = op === '*' ? '×' : op;

    gameArea.innerHTML = `
        <div class="game-timer">⏱️ <span id="mathTime">${mathTimeLeft}</span>s</div>
        <p style="color:#666;margin-bottom:10px;">Problema ${mathCorrect + 1}/${mathTotal}</p>
        <div class="math-problem">${a} ${opDisplay} ${b} = ?</div>
        <input type="number" class="math-input" id="mathInput" autofocus onkeypress="checkMathAnswer(event)">
    `;

    document.getElementById('mathInput').focus();

    clearInterval(mathTimer);
    mathTimer = setInterval(() => {
        mathTimeLeft--;
        const timeEl = document.getElementById('mathTime');
        if (timeEl) timeEl.textContent = mathTimeLeft;
        if (mathTimeLeft <= 0) {
            clearInterval(mathTimer);
            endGame(false);
        }
    }, 1000);
}

function checkMathAnswer(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('mathInput');
        if (parseInt(input.value) === mathAnswer) {
            mathCorrect++;
            showMathProblem();
        } else {
            clearInterval(mathTimer);
            endGame(false);
        }
    }
}

// ============================================
// JOGO 4: DIGITAÇÃO RÁPIDA
// ============================================

let typingWord = '';
let typingTimer = null;
let typingTimeLeft = 6;

function startTypingGame() {
    const words = ['AMOR', 'PAIXAO', 'CORACAO', 'CARINHO', 'SAUDADE', 'ABRACO', 'BEIJO', 'ETERNO'];
    typingWord = words[Math.floor(Math.random() * words.length)];
    typingTimeLeft = 6;

    gameArea.innerHTML = `
        <div class="game-timer">⏱️ <span id="typingTime">${typingTimeLeft}</span>s</div>
        <div class="typing-word">${typingWord}</div>
        <input type="text" class="typing-input" id="typingInput" autofocus oninput="checkTyping()" maxlength="${typingWord.length}">
    `;

    document.getElementById('typingInput').focus();

    typingTimer = setInterval(() => {
        typingTimeLeft--;
        const timeEl = document.getElementById('typingTime');
        if (timeEl) timeEl.textContent = typingTimeLeft;
        if (typingTimeLeft <= 0) {
            clearInterval(typingTimer);
            endGame(false);
        }
    }, 1000);
}

function checkTyping() {
    const input = document.getElementById('typingInput');
    const value = input.value.toUpperCase();

    if (value === typingWord) {
        clearInterval(typingTimer);
        input.classList.add('correct');
        setTimeout(() => endGame(true), 500);
    } else if (!typingWord.startsWith(value)) {
        input.classList.add('wrong');
        setTimeout(() => input.classList.remove('wrong'), 200);
    }
}

// ============================================
// JOGO 5: ACERTE OS CORAÇÕES
// ============================================

let catchScore = 0;
let catchTarget = 10;
let catchTimer = null;
let catchTimeLeft = 12;
let catchInterval = null;

function startCatchGame() {
    catchScore = 0;
    catchTimeLeft = 12;

    gameArea.innerHTML = `
        <div class="game-timer">⏱️ <span id="catchTime">${catchTimeLeft}</span>s</div>
        <div class="catch-score">Capturados: <span id="catchScore">0</span>/${catchTarget}</div>
        <div class="catch-area" id="catchArea"></div>
    `;

    catchTimer = setInterval(() => {
        catchTimeLeft--;
        const timeEl = document.getElementById('catchTime');
        if (timeEl) timeEl.textContent = catchTimeLeft;
        if (catchTimeLeft <= 0) {
            clearInterval(catchTimer);
            clearInterval(catchInterval);
            endGame(false);
        }
    }, 1000);

    catchInterval = setInterval(spawnCatchHeart, 700);
    spawnCatchHeart();
}

function spawnCatchHeart() {
    const area = document.getElementById('catchArea');
    if (!area) return;

    const heart = document.createElement('div');
    heart.className = 'catch-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * (area.offsetWidth - 40) + 'px';
    heart.style.top = Math.random() * (area.offsetHeight - 40) + 'px';

    heart.onclick = function() {
        catchScore++;
        const scoreEl = document.getElementById('catchScore');
        if (scoreEl) scoreEl.textContent = catchScore;
        this.remove();

        if (catchScore >= catchTarget) {
            clearInterval(catchTimer);
            clearInterval(catchInterval);
            endGame(true);
        }
    };

    area.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, 1500);
}

// ============================================
// JOGO 6: PUZZLE DESLIZANTE
// ============================================

let puzzleTiles = [];
let puzzleEmpty = 8;
let puzzleTimer = null;
let puzzleTimeLeft = 45;
let puzzleMoves = 0;

function startPuzzleGame() {
    puzzleTimeLeft = 45;
    puzzleMoves = 0;

    // Gerar puzzle solucionável
    puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    // Fazer movimentos aleatórios para embaralhar (garante solução)
    for (let i = 0; i < 30; i++) {
        const possibleMoves = getPuzzlePossibleMoves();
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        swapPuzzleTiles(randomMove, puzzleTiles.indexOf(0));
    }

    puzzleEmpty = puzzleTiles.indexOf(0);
    renderPuzzle();

    puzzleTimer = setInterval(() => {
        puzzleTimeLeft--;
        const timeEl = document.getElementById('puzzleTime');
        if (timeEl) timeEl.textContent = puzzleTimeLeft;
        if (puzzleTimeLeft <= 0) {
            clearInterval(puzzleTimer);
            endGame(false);
        }
    }, 1000);
}

function getPuzzlePossibleMoves() {
    const empty = puzzleTiles.indexOf(0);
    const moves = [];
    const row = Math.floor(empty / 3);
    const col = empty % 3;

    if (row > 0) moves.push(empty - 3);
    if (row < 2) moves.push(empty + 3);
    if (col > 0) moves.push(empty - 1);
    if (col < 2) moves.push(empty + 1);

    return moves;
}

function swapPuzzleTiles(a, b) {
    [puzzleTiles[a], puzzleTiles[b]] = [puzzleTiles[b], puzzleTiles[a]];
}

function renderPuzzle() {
    let html = `
        <div class="game-timer">⏱️ <span id="puzzleTime">${puzzleTimeLeft}</span>s</div>
        <div class="puzzle-grid">
    `;

    puzzleTiles.forEach((tile, index) => {
        if (tile === 0) {
            html += `<button class="puzzle-tile empty" data-index="${index}"></button>`;
        } else {
            html += `<button class="puzzle-tile" data-index="${index}" onclick="movePuzzleTile(${index})">${tile}</button>`;
        }
    });

    html += '</div>';
    gameArea.innerHTML = html;
}

function movePuzzleTile(index) {
    const emptyIndex = puzzleTiles.indexOf(0);
    const possibleMoves = getPuzzlePossibleMoves();

    if (possibleMoves.includes(index)) {
        swapPuzzleTiles(index, emptyIndex);
        puzzleMoves++;
        renderPuzzle();

        if (checkPuzzleSolved()) {
            clearInterval(puzzleTimer);
            endGame(true);
        }
    }
}

function checkPuzzleSolved() {
    for (let i = 0; i < 8; i++) {
        if (puzzleTiles[i] !== i + 1) return false;
    }
    return puzzleTiles[8] === 0;
}

// ============================================
// JOGO 7: REFLEXO RÁPIDO
// ============================================

let reactionStartTime = 0;
let reactionTimeout = null;
let reactionState = 'waiting';

function startReactionGame() {
    reactionState = 'waiting';

    gameArea.innerHTML = `
        <p class="game-instructions">Clique quando a caixa ficar VERDE!</p>
        <div class="reaction-box waiting" id="reactionBox" onclick="reactionClick()">
            <span class="reaction-text">Aguarde...</span>
        </div>
        <div class="reaction-time" id="reactionTime"></div>
    `;

    const delay = Math.random() * 3000 + 2000;
    reactionTimeout = setTimeout(() => {
        const box = document.getElementById('reactionBox');
        if (box && reactionState === 'waiting') {
            box.className = 'reaction-box ready';
            box.querySelector('.reaction-text').textContent = 'CLIQUE AGORA!';
            reactionStartTime = Date.now();
            reactionState = 'ready';
        }
    }, delay);
}

function reactionClick() {
    const box = document.getElementById('reactionBox');
    const timeDisplay = document.getElementById('reactionTime');

    if (reactionState === 'waiting') {
        clearTimeout(reactionTimeout);
        box.className = 'reaction-box clicked';
        box.querySelector('.reaction-text').textContent = 'Muito cedo!';
        timeDisplay.textContent = 'Você clicou antes da hora!';
        setTimeout(() => endGame(false), 1000);
    } else if (reactionState === 'ready') {
        const reactionTime = Date.now() - reactionStartTime;
        box.className = 'reaction-box clicked';
        box.querySelector('.reaction-text').textContent = `${reactionTime}ms`;

        if (reactionTime <= 400) {
            timeDisplay.textContent = 'Excelente reflexo!';
            setTimeout(() => endGame(true), 1000);
        } else {
            timeDisplay.textContent = 'Muito lento! (máx: 400ms)';
            setTimeout(() => endGame(false), 1000);
        }
        reactionState = 'done';
    }
}

// ============================================
// JOGO 8: ENCONTRE O DIFERENTE
// ============================================

let differentRound = 0;
let differentTarget = 3;

function startDifferentGame() {
    differentRound = 0;
    showDifferentRound();
}

function showDifferentRound() {
    if (differentRound >= differentTarget) {
        endGame(true);
        return;
    }

    const emojiSets = [
        { normal: '🍎', different: '🍏' },
        { normal: '🌕', different: '🌑' },
        { normal: '😊', different: '😄' },
        { normal: '🔵', different: '🔴' },
        { normal: '⬛', different: '⬜' },
        { normal: '🌸', different: '🌺' },
        { normal: '🐱', different: '🐶' },
        { normal: '❤️', different: '💜' }
    ];

    const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
    const gridSize = 16;
    const differentIndex = Math.floor(Math.random() * gridSize);

    let html = `
        <p style="color:#666;margin-bottom:15px;">Rodada ${differentRound + 1}/${differentTarget}</p>
        <div class="different-grid">
    `;

    for (let i = 0; i < gridSize; i++) {
        const emoji = i === differentIndex ? set.different : set.normal;
        const isCorrect = i === differentIndex;
        html += `<div class="different-item" onclick="checkDifferent(this, ${isCorrect})">${emoji}</div>`;
    }

    html += '</div>';
    gameArea.innerHTML = html;
}

function checkDifferent(element, isCorrect) {
    if (isCorrect) {
        element.classList.add('correct');
        differentRound++;
        setTimeout(showDifferentRound, 500);
    } else {
        element.classList.add('wrong');
        setTimeout(() => endGame(false), 500);
    }
}

// ============================================
// JOGO 9: LABIRINTO
// ============================================

let mazePlayerPos = { x: 20, y: 20 };
let mazeGoalPos = { x: 255, y: 255 };
let mazeWalls = [];
let mazeTimer = null;
let mazeTimeLeft = 25;
let mazeKeyHandler = null;

function startMazeGame() {
    mazePlayerPos = { x: 20, y: 20 };
    mazeGoalPos = { x: 255, y: 255 };
    mazeTimeLeft = 25;

    // Criar paredes
    mazeWalls = [
        { x: 80, y: 0, w: 15, h: 180 },
        { x: 0, y: 80, w: 60, h: 15 },
        { x: 140, y: 60, w: 15, h: 180 },
        { x: 140, y: 60, w: 100, h: 15 },
        { x: 200, y: 120, w: 15, h: 120 },
        { x: 80, y: 200, w: 100, h: 15 },
        { x: 0, y: 160, w: 60, h: 15 },
        { x: 240, y: 180, w: 60, h: 15 }
    ];

    renderMaze();

    mazeKeyHandler = function(e) {
        const speed = 10;
        let newX = mazePlayerPos.x;
        let newY = mazePlayerPos.y;

        if (e.key === 'ArrowUp' || e.key === 'w') newY -= speed;
        if (e.key === 'ArrowDown' || e.key === 's') newY += speed;
        if (e.key === 'ArrowLeft' || e.key === 'a') newX -= speed;
        if (e.key === 'ArrowRight' || e.key === 'd') newX += speed;

        // Limites
        newX = Math.max(0, Math.min(275, newX));
        newY = Math.max(0, Math.min(275, newY));

        // Verificar colisão com paredes
        if (!checkMazeCollision(newX, newY)) {
            mazePlayerPos.x = newX;
            mazePlayerPos.y = newY;
            updateMazePlayer();
            checkMazeGoal();
        }
    };

    document.addEventListener('keydown', mazeKeyHandler);

    mazeTimer = setInterval(() => {
        mazeTimeLeft--;
        const timeEl = document.getElementById('mazeTime');
        if (timeEl) timeEl.textContent = mazeTimeLeft;
        if (mazeTimeLeft <= 0) {
            cleanupMaze();
            endGame(false);
        }
    }, 1000);
}

function renderMaze() {
    let wallsHtml = mazeWalls.map(w =>
        `<div class="maze-wall" style="left:${w.x}px;top:${w.y}px;width:${w.w}px;height:${w.h}px;"></div>`
    ).join('');

    gameArea.innerHTML = `
        <div class="game-timer">⏱️ <span id="mazeTime">${mazeTimeLeft}</span>s</div>
        <div class="maze-container" id="mazeContainer">
            ${wallsHtml}
            <div class="maze-goal" style="left:${mazeGoalPos.x}px;top:${mazeGoalPos.y}px;">🏁</div>
            <div class="maze-player" id="mazePlayer" style="left:${mazePlayerPos.x}px;top:${mazePlayerPos.y}px;">💖</div>
        </div>
        <p style="color:#666;margin-top:10px;font-size:0.9rem;">Use as setas ou WASD para mover</p>
        <div class="maze-instructions-keys">
            <button class="key-btn" onclick="moveMaze('up')">↑</button>
            <button class="key-btn" onclick="moveMaze('left')">←</button>
            <button class="key-btn" onclick="moveMaze('down')">↓</button>
            <button class="key-btn" onclick="moveMaze('right')">→</button>
        </div>
    `;
}

function moveMaze(direction) {
    const speed = 15;
    let newX = mazePlayerPos.x;
    let newY = mazePlayerPos.y;

    if (direction === 'up') newY -= speed;
    if (direction === 'down') newY += speed;
    if (direction === 'left') newX -= speed;
    if (direction === 'right') newX += speed;

    newX = Math.max(0, Math.min(275, newX));
    newY = Math.max(0, Math.min(275, newY));

    if (!checkMazeCollision(newX, newY)) {
        mazePlayerPos.x = newX;
        mazePlayerPos.y = newY;
        updateMazePlayer();
        checkMazeGoal();
    }
}

function checkMazeCollision(x, y) {
    const playerSize = 25;
    for (const wall of mazeWalls) {
        if (x < wall.x + wall.w && x + playerSize > wall.x &&
            y < wall.y + wall.h && y + playerSize > wall.y) {
            return true;
        }
    }
    return false;
}

function updateMazePlayer() {
    const player = document.getElementById('mazePlayer');
    if (player) {
        player.style.left = mazePlayerPos.x + 'px';
        player.style.top = mazePlayerPos.y + 'px';
    }
}

function checkMazeGoal() {
    const dist = Math.sqrt(
        Math.pow(mazePlayerPos.x - mazeGoalPos.x, 2) +
        Math.pow(mazePlayerPos.y - mazeGoalPos.y, 2)
    );

    if (dist < 35) {
        cleanupMaze();
        endGame(true);
    }
}

function cleanupMaze() {
    clearInterval(mazeTimer);
    if (mazeKeyHandler) {
        document.removeEventListener('keydown', mazeKeyHandler);
        mazeKeyHandler = null;
    }
}

// ============================================
// JOGO 10: SEQUÊNCIA NUMÉRICA
// ============================================

let sequenceRound = 0;
let sequenceTarget = 3;
let sequenceAnswer = 0;

function startSequenceGame() {
    sequenceRound = 0;
    showSequenceRound();
}

function showSequenceRound() {
    if (sequenceRound >= sequenceTarget) {
        endGame(true);
        return;
    }

    const sequences = [
        { nums: [2, 4, 6, 8], answer: 10, rule: '+2' },
        { nums: [3, 6, 9, 12], answer: 15, rule: '+3' },
        { nums: [1, 2, 4, 8], answer: 16, rule: '×2' },
        { nums: [5, 10, 15, 20], answer: 25, rule: '+5' },
        { nums: [1, 4, 9, 16], answer: 25, rule: 'quadrados' },
        { nums: [2, 6, 12, 20], answer: 30, rule: '+4,+6,+8,+10' },
        { nums: [1, 1, 2, 3, 5], answer: 8, rule: 'fibonacci' },
        { nums: [100, 90, 80, 70], answer: 60, rule: '-10' }
    ];

    const seq = sequences[Math.floor(Math.random() * sequences.length)];
    sequenceAnswer = seq.answer;

    // Gerar opções
    const options = [seq.answer];
    while (options.length < 4) {
        const wrong = seq.answer + (Math.floor(Math.random() * 10) - 5);
        if (!options.includes(wrong) && wrong !== seq.answer && wrong > 0) {
            options.push(wrong);
        }
    }
    const shuffledOptions = shuffleArray(options);

    let html = `
        <p style="color:#666;margin-bottom:15px;">Rodada ${sequenceRound + 1}/${sequenceTarget}</p>
        <div class="sequence-display">${seq.nums.join(' → ')} → ?</div>
        <div class="sequence-options">
    `;

    shuffledOptions.forEach(opt => {
        html += `<button class="sequence-option" onclick="checkSequence(${opt})">${opt}</button>`;
    });

    html += '</div>';
    gameArea.innerHTML = html;
}

function checkSequence(answer) {
    if (answer === sequenceAnswer) {
        sequenceRound++;
        showSequenceRound();
    } else {
        endGame(false);
    }
}

// ============================================
// JOGO 11: QUIZ DO AMOR
// ============================================

let quizRound = 0;
let quizTarget = 3;

function startQuizGame() {
    quizRound = 0;
    showQuizQuestion();
}

function showQuizQuestion() {
    if (quizRound >= quizTarget) {
        endGame(true);
        return;
    }

    const questions = [
        {
            q: "Qual é a base mais importante de um relacionamento?",
            options: ["Dinheiro", "Confiança", "Aparência", "Fama"],
            correct: 1
        },
        {
            q: "O que significa amar de verdade?",
            options: ["Controlar a pessoa", "Aceitar e respeitar", "Ter ciúmes sempre", "Mudar o outro"],
            correct: 1
        },
        {
            q: "Como resolver conflitos em um relacionamento?",
            options: ["Ignorar sempre", "Conversar com respeito", "Gritar mais alto", "Fugir do problema"],
            correct: 1
        },
        {
            q: "Qual atitude fortalece o amor?",
            options: ["Guardar rancor", "Demonstrar carinho", "Ser indiferente", "Criticar sempre"],
            correct: 1
        },
        {
            q: "O que é essencial para manter o romance?",
            options: ["Presentes caros", "Atenção e tempo juntos", "Redes sociais", "Competição"],
            correct: 1
        },
        {
            q: "Qual é a linguagem universal do amor?",
            options: ["Dinheiro", "Gestos de carinho", "Status social", "Beleza física"],
            correct: 1
        }
    ];

    // Embaralhar e pegar uma questão não usada
    const shuffledQuestions = shuffleArray(questions);
    const question = shuffledQuestions[quizRound % shuffledQuestions.length];

    let html = `
        <p style="color:#666;margin-bottom:15px;">Pergunta ${quizRound + 1}/${quizTarget}</p>
        <div class="quiz-question">${question.q}</div>
        <div class="quiz-options">
    `;

    question.options.forEach((opt, index) => {
        const isCorrect = index === question.correct;
        html += `<button class="quiz-option" onclick="checkQuiz(this, ${isCorrect})">${opt}</button>`;
    });

    html += '</div>';
    gameArea.innerHTML = html;
}

function checkQuiz(element, isCorrect) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');

    if (isCorrect) {
        element.classList.add('correct');
        quizRound++;
        setTimeout(showQuizQuestion, 800);
    } else {
        element.classList.add('wrong');
        setTimeout(() => endGame(false), 800);
    }
}

// ============================================
// JOGO 12: TIMING PERFEITO
// ============================================

let timingHits = 0;
let timingAttempts = 0;
let timingMaxAttempts = 5;
let timingRequiredHits = 3;
let timingMarkerPos = 0;
let timingDirection = 1;
let timingInterval = null;
let timingSpeed = 4;

function startTimingGame() {
    timingHits = 0;
    timingAttempts = 0;
    timingMarkerPos = 0;
    timingDirection = 1;

    gameArea.innerHTML = `
        <p style="color:#666;margin-bottom:10px;">Acertos: <span id="timingHits">0</span>/${timingRequiredHits} (Tentativas: <span id="timingAttempts">0</span>/${timingMaxAttempts})</p>
        <div class="timing-bar-container">
            <div class="timing-target"></div>
            <div class="timing-marker" id="timingMarker"></div>
        </div>
        <button class="btn-timing" onclick="timingStop()">PARAR!</button>
    `;

    timingInterval = setInterval(() => {
        timingMarkerPos += timingSpeed * timingDirection;

        if (timingMarkerPos >= 342 || timingMarkerPos <= 0) {
            timingDirection *= -1;
        }

        const marker = document.getElementById('timingMarker');
        if (marker) {
            marker.style.left = timingMarkerPos + 'px';
        }
    }, 16);
}

function timingStop() {
    timingAttempts++;
    document.getElementById('timingAttempts').textContent = timingAttempts;

    // Zona verde está de 145 a 205 (60px de largura, centro em 175)
    const targetStart = 145;
    const targetEnd = 205;

    if (timingMarkerPos >= targetStart && timingMarkerPos <= targetEnd) {
        timingHits++;
        document.getElementById('timingHits').textContent = timingHits;
    }

    if (timingHits >= timingRequiredHits) {
        clearInterval(timingInterval);
        endGame(true);
    } else if (timingAttempts >= timingMaxAttempts) {
        clearInterval(timingInterval);
        endGame(false);
    }
}

// ============================================
// EXPLOSÃO DE CORAÇÕES (sucesso final)
// ============================================

function createHeartExplosion() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = 50 + (Math.random() - 0.5) * 80 + '%';
            heart.style.top = 50 + (Math.random() - 0.5) * 80 + '%';
            const angle = Math.random() * 360;
            const distance = Math.random() * 300 + 100;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            heart.style.animation = `explodeCustom 2s ease-out forwards`;
            heartExplosion.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

// Adicionar animação customizada via CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes explodeCustom {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(-50% + var(--tx, 0px)),
                calc(-50% + var(--ty, 0px))
            ) scale(1.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
