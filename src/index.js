import './styles.css'
import { startGame } from './modules/game'

// TODO (Phase 4): once Ship, Gameboard and Player are tested and working,
// call your game setup from here, e.g. startGame().
// This file should stay tiny - it only wires things together.
// Wait for DOM trees to finish constructing before starting initialization
document.addEventListener('DOMContentLoaded', () => {
  startGame();
});
