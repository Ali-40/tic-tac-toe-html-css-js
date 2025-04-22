const setupScreen = document.getElementById('setup-screen');
const board = document.getElementById('board');
const startBtn = document.getElementById('start-game');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const symbolRadios = document.getElementsByName('symbol');

const cells = document.querySelectorAll('[data-cell]');
const winningMessage = document.getElementById('winning-message');
const winningText = document.getElementById('winning-message-text');
const restartButton = document.getElementById('restart-button');
const turnIndicator = document.getElementById('current-turn');


let player1 = '';
let player2 = '';
let playerX = '';
let playerO = '';
let oTurn = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startBtn.addEventListener('click', () => {
    player1 = player1Input.value.trim();
    player2 = player2Input.value.trim();

    if (!player1 || !player2) {
        alert("Please enter both player names!");
        return;
    }

    const selectedSymbol = [...symbolRadios].find(r => r.checked).value;
    if (selectedSymbol === 'x') {
        playerX = player1;
        playerO = player2;
    } else {
        playerX = player2;
        playerO = player1;
    }

    setupScreen.style.display = 'none';
    board.style.display = 'grid';
    winningMessage.style.display = 'block';

    startGame();
});

restartButton.addEventListener('click', startGame);

function startGame() {
    turnIndicator.innerText = 'X';
    oTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'winner'); 
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessage.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? 'o' : 'x';
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
    oTurn = !oTurn;
    turnIndicator.innerText = oTurn ? 'O' : 'X';
}


function checkWin(currentClass) {
    for (let combination of WINNING_COMBINATIONS) {
        if (combination.every(index => cells[index].classList.contains(currentClass))) { 
            combination.forEach(index => {
                cells[index].classList.add('winner'); 
            });
            return true;
        }
    }
    return false;
}


function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw) {
    if (draw) {
        winningText.innerText = "Unentschieden!";
    } else {
        const winner = oTurn ? playerO : playerX;
        winningText.innerText = `${winner} won!`;
    }
    winningMessage.classList.add('show');
}
