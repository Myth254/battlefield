// Game controller: creates the players, runs turns, decides when the game ends.
// It connects Player/Gameboard (logic) to dom.js (drawing).
// Per the lesson: "if you feel the need to keep track of the current
// player's turn, manage that in this module."

// import Player from './player';
// import { ... } from './dom';

// TODO (Phase 4): startGame()
//   1. create a human Player and a computer Player
//   2. place ships on both boards at predetermined coordinates (for now)
//   3. render both boards
//   4. listen for clicks on the enemy board
//
// TODO (Phase 4): playTurn([row, col])
//   1. human attacks the computer's board
//   2. re-render
//   3. if the computer's ships are all sunk -> human wins, stop
//   4. computer takes a random legal turn
//   5. re-render
//   6. if the human's ships are all sunk -> computer wins, stop
//
// TODO (Phase 4): ignore clicks on squares that were already attacked,
// and ignore clicks after the game is over.

export {};
