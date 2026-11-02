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

export {};