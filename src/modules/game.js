// Game controller: creates the players, runs turns, decides when the game ends.
// It connects Player/Gameboard (logic) to dom.js (drawing).
// Per the lesson: "if you feel the need to keep track of the current
// player's turn, manage that in this module."
import Player from './player';
import { renderBoard, bindEnemyBoardClicks, setStatus } from './dom.js';

let humanPlayer = null;
let computerPlayer = null;
let isGameOver = false;

// DOM selectors matching standard layouts
let playerContainer = null;
let enemyContainer = null;

// TODO (Phase 4): startGame()
//   1. create a human Player and a computer Player
//   2. place ships on both boards at predetermined coordinates (for now)
//   3. render both boards
//   4. listen for clicks on the enemy board
export function startGame() {
    isGameOver = false

    // 1. Create a human Player and a computer Player
    humanPlayer = new Player('human')
    computerPlayer = new Player('computer')

    playerContainer = document.getElementById('player-board')
    enemyContainer = document.getElementById('enemy-board')

    // 2. Place ships on both boards at predetermined coordinates
    // Human ships
    humanPlayer.board.placeShip(4, [0, 0], 'horizontal')
    humanPlayer.board.placeShip(3, [2, 0], 'vertical')
    humanPlayer.board.placeShip(2, [5, 0], 'horizontal')

    // Computer ships
    computerPlayer.board.placeShip(4, [0, 0], 'horizontal')
    computerPlayer.board.placeShip(3, [2, 2], 'vertical')
    computerPlayer.board.placeShip(2, [5, 5], 'horizontal')

    // 3. Render both boards
    updateUI()
    setStatus('Your turn! Click on the enemy board to strike.')

    // 4. Listen for clicks on the enemy board
    bindEnemyBoardClicks(enemyContainer, (coords) => {
        playTurn(coords)
    })
}

// TODO (Phase 4): playTurn([row, col])
//   1. human attacks the computer's board
//   2. re-render
//   3. if the computer's ships are all sunk -> human wins, stop
//   4. computer takes a random legal turn
//   5. re-render
//   6. if the human's ships are all sunk -> computer wins, stop
export function playTurn([row, col]) {
    // Ignore clicks if the game is already over
    if (isGameOver) return

    // Ignore clicks on squares that were already attacked
    const coordKey = `${row},${col}`
    if (computerPlayer.board.hits.has(coordKey) || computerPlayer.board.misses.has(coordKey)) {
        setStatus("You've already attacked that coordinate! Try somewhere else.");
        return
    }

    // 1. Human attacks the computer's board
    humanPlayer.attack(computerPlayer.board, [row, col]);
    updateUI()

    // 3. If the computer's ships are all sunk -> human wins
    if (computerPlayer.board.allShipsSunk()) {
        setStatus('Victory! You have destroyed the enemy fleet!');
        isGameOver = true;
        return;
    }

    // 4. Computer takes a random legal turn
    setStatus('Computer is aiming...');

    // Minor safety timeout to simulate thinking time elegantly
    setTimeout(() => {
        if (isGameOver) return;
        
        computerPlayer.randomAttack(humanPlayer.board);
        updateUI();

        // 6. If the human's ships are all sunk -> computer wins
        if (humanPlayer.board.allShipsSunk()) {
            setStatus('Defeat! All your ships have been sent to the bottom.');
            isGameOver = true;
            return;
        }

        setStatus('Your turn! Click on the enemy board to strike.');
    }, 400);
}
// TODO (Phase 4): ignore clicks on squares that were already attacked,
// and ignore clicks after the game is over.
function updateUI() {
  // Render human board revealing ships; hide un-hit computer ships
  renderBoard(humanPlayer.board, playerContainer, { hideShips: false });
  renderBoard(computerPlayer.board, enemyContainer, { hideShips: true });
}
