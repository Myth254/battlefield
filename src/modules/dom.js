// DOM module: the ONLY place (besides index.js) that touches `document`.
// The lesson says NOT to unit test this, so keep it thin: it reads state
// from Gameboard and draws it. No game rules in here.

// TODO (Phase 4): renderBoard(gameboard, containerElement, { hideShips })
//   - clear the container
//   - create 100 .cell elements (data-row / data-col attributes help a lot)
//   - add .ship / .hit / .miss classes based on the gameboard's state
//   - for the enemy board, do NOT reveal un-hit ships
//
// TODO (Phase 4): a way to tell game.js when a cell is clicked
//   e.g. bindEnemyBoardClicks(handler) -> handler([row, col])
//
// TODO (Phase 4): setStatus(message) to update #status

export function renderBoard(gameboard, containerElement, { hideShips = false } = {}) {
    containerElement.innerHTML = ''

    const size = gameboard.size || 10

    // Create 100 .cell elements
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.dataset.row = r
            cell.dataset.col = c

            const hasShip = gameboard.grid[r][c] !== null
            const isHit = gameboard.hits.has(`${r},${c}`)
            const isMiss = gameboard.misses.has(`${r},${c}`)

            if (isHit) {
                cell.classList.add('hit')
            } else if (isMiss) {
                cell.classList.add('miss')
            } else if (hasShip && !hideShips) {
                // Only show un-hit ships if hideShips rule is false
                cell.classList.add('ship')
            }

            containerElement.appendChild(cell)
        }
    }
}

export function bindPlayerBoardClicks(containerElement, handler) {
  containerElement.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    handler([row, col]);
  });
}

export function bindRotateButtonClick(handler) {
  const rotateBtn = document.getElementById('rotate-btn');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', handler);
  }
}

export function updateRotateButtonText(direction) {
  const rotateBtn = document.getElementById('rotate-btn');
  if (rotateBtn) {
    rotateBtn.textContent = `Orientation: ${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
  }
}

export function bindEnemyBoardClicks(containerElement, handler) {
    containerElement.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell')
        if (!cell) return

        // read the coordinates and pass them up to the coordinator
        const row = parseInt(cell.dataset.row, 10)
        const col = parseInt(cell.dataset.col, 10)

        handler([row, col])
    })
}

export function setStatus(message) {
    const statusEl = document.getElementById('status')
    if (statusEl) {
        statusEl.textContent = message
    }
}

export function bindResetButtonClick(handler) {
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    // When the button is clicked, trigger the reset loop handler
    resetBtn.addEventListener('click', handler);
  }
}

