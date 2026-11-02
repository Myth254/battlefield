// Game controller: creates the players, runs turns, decides when the game ends.
// It connects Player/Gameboard (logic) to dom.js (drawing).
// Per the lesson: "if you feel the need to keep track of the current
// player's turn, manage that in this module."
import Player from './player';
import { 
  renderBoard, 
  bindEnemyBoardClicks, 
  bindPlayerBoardClicks, 
  bindResetButtonClick, 
  bindRotateButtonClick, 
  updateRotateButtonText, 
  setStatus 
} from './dom'

let humanPlayer = null
let computerPlayer = null
let isGameOver = false
let hasInitializedEvents = false // Flag to prevent stacking duplicate click handlers

// State machines tracking the placement cycle
let isPlacementPhase = true;
let currentShipIndex = 0;
let currentDirection = 'horizontal'; // 'horizontal' or 'vertical'

// Fleet layout definitions (Standard configuration lengths)
const fleetTemplates = [5, 4, 3, 2]
const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Patrol Boat'];

// DOM selectors matching standard layouts
let playerContainer = null
let enemyContainer = null

export function startGame() {
    isGameOver = false
    isPlacementPhase = true
    currentShipIndex = 0
    currentDirection = 'horizontal'

    // 1. Create a human Player and a computer Player
    humanPlayer = new Player('human')
    computerPlayer = new Player('computer')
    
    playerContainer = document.getElementById('player-board')
    enemyContainer = document.getElementById('enemy-board')

    document.getElementById('enemy-board').classList.add('disabled')
    updateRotateButtonText(currentDirection)

    // 1. Generate the computer's ships randomly hidden in memory
    generateComputerShipsRandomly(computerPlayer.gameboard)

    // 3. Render both boards
    updateUI()
    updatePlacementStatus()

    // 4. Bind event listeners ONLY the very first time the game fires up
    if (!hasInitializedEvents) {
        // Player Setup Click Routing
        bindPlayerBoardClicks(playerContainer, (coords) => {
            if (!isPlacementPhase) return;
            handlePlayerPlacement(coords);
        });

        // Enemy Attack Click Routing
        bindEnemyBoardClicks(enemyContainer, (coords) => {
            playTurn(coords);
        });

        // Rotation Switch Trigger
        bindRotateButtonClick(() => {
            if (!isPlacementPhase) return
            currentDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal'
            updateRotateButtonText(currentDirection)
        })

        // Wire up the reset button to re-trigger this exact function loop
        bindResetButtonClick(() => {
            startGame();
        });

        hasInitializedEvents = true; // Mark bound so we skip this block on subsequent resets
    }
}

function handlePlayerPlacement(coords) {
    const currentLength = fleetTemplates[currentShipIndex]

    const placementSuccessful = humanPlayer.gameboard.placeShip(currentLength, coords, currentDirection)

    if (placementSuccessful) {
        currentShipIndex++
        updateUI()

        // Check if player finished placing all ships
        if (currentShipIndex >= fleetTemplates.length) {
            isPlacementPhase = false
            document.getElementById('enemy-board').classList.remove('disabled');
            setStatus('All ships deployed! Click on Enemy Waters to launch your first strike.');
        } else {
            updatePlacementStatus();
        }
    } else {
        setStatus(`Invalid placement! Your ${shipNames[currentShipIndex]} can't sit there.`);
    }
}

function generateComputerShipsRandomly(computerBoard) {
  const directions = ['horizontal', 'vertical'];
  
  fleetTemplates.forEach((length) => {
    let placed = false;
    
    // Safety fallback: loop until it rolls valid open space coordinates
    while (!placed) {
      const randRow = Math.floor(Math.random() * computerBoard.size);
      const randCol = Math.floor(Math.random() * computerBoard.size);
      const randDirection = directions[Math.floor(Math.random() * directions.length)];
      
      placed = computerBoard.placeShip(length, [randRow, randCol], randDirection);
    }
  });
}

function updatePlacementStatus() {
  setStatus(`Place your ${shipNames[currentShipIndex]} (Length: ${fleetTemplates[currentShipIndex]})`);
}

export function playTurn([row, col]) {
    // Ignore clicks if the game is already over
    if (isGameOver || isPlacementPhase) return

    // Ignore clicks on squares that were already attacked
    const coordKey = `${row},${col}`
    if (computerPlayer.gameboard.hits.has(coordKey) || computerPlayer.gameboard.misses.has(coordKey)) {
        setStatus("You've already attacked that coordinate! Try somewhere else.");
        return
    }

    humanPlayer.attack(computerPlayer.gameboard, [row, col]);
    updateUI()

    // If the computer's ships are all sunk -> human wins
    if (computerPlayer.gameboard.allShipsSunk()) {
        setStatus('Victory! You have destroyed the enemy fleet!');
        isGameOver = true;
        return;
    }

    // 4. Computer takes a random legal turn
    setStatus('Computer is aiming...');

    // Minor safety timeout to simulate thinking time elegantly
    setTimeout(() => {
        if (isGameOver) return;
        
        computerPlayer.randomAttack(humanPlayer.gameboard);
        updateUI();

        // 6. If the human's ships are all sunk -> computer wins
        if (humanPlayer.gameboard.allShipsSunk()) {
            setStatus('Defeat! All your ships have been sent to the bottom.')
            isGameOver = true
            return;
        }

        setStatus('Your turn! Click on the enemy board to strike.');
    }, 400);
}
// TODO (Phase 4): ignore clicks on squares that were already attacked,
// and ignore clicks after the game is over.
function updateUI() {
  // Render human board revealing ships; hide un-hit computer ships
  renderBoard(humanPlayer.gameboard, playerContainer, { hideShips: false });
  renderBoard(computerPlayer.gameboard, enemyContainer, { hideShips: true });
}