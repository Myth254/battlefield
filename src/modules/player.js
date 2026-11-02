import Gameboard from './gameboard';

// Two kinds of players share one class: 'human' and 'computer'.
// Each player owns its OWN gameboard (the one the enemy attacks).
//
// Suggested API:
//   new Player('human' | 'computer')
//   player.board                       -> this player's Gameboard
//   player.attack(enemyBoard, coords)  -> human: attack chosen coordinates
//   player.randomAttack(enemyBoard)    -> computer: pick a legal random square, attack it

export default class Player {
  constructor(type = 'human') {
    // TODO: store the type and create this player's gameboard
    this.type = type
    this.gameboard = new Gameboard()

    // For computer AI: Pre-populate all possible 100 board coordinates
    // This scales perfectly and prevents duplicate selection instantly
    this.availableComputerMoves = []
    if (this.type === 'computer') {
      for (let r = 0; r < this.gameboard.size; r++) {
        for (let c = 0; c < this.gameboard.size; c++) {
          this.availableComputerMoves.push([r, c])
        }
      }
    }
  }

  attack(enemyBoard, coordinates) {
    if (!coordinates && this.type === 'computer') {
      return this.randomAttack(enemyBoard)
    }
    const [row, col] = coordinates

    // Optional safety step: Keep the computer's available pool synced
    // if a human plays manually or turns alternate dynamically.
    this._removeFromAvailableMoves(row, col)

    const targetBoard = enemyBoard.gameboard ?? enemyBoard
    return targetBoard.receiveAttack(row, col)
  }

  // missedAttacks() {
  //   return this.gameboard.missedAttacks
  // }

  randomAttack(enemyBoard) {
    // TODO: choose a random square that hasn't been attacked yet, then attack it.
    // The computer must never shoot the same square twice.
    // Hint: to make this testable, keep a list of squares already tried
    // (or of squares still available) and pick from that.
    if (this.availableComputerMoves.length === 0) {
      return false
    }

    const randomIndex = Math.floor(Math.random() * this.availableComputerMoves.length)

    const [[row, col]] = this.availableComputerMoves.splice(randomIndex, 1)

    const targetBoard = enemyBoard.gameboard ?? enemyBoard
    return targetBoard.receiveAttack(row, col)
  }

  // Internal helper to keep available move tracking clean
  _removeFromAvailableMoves(row, col) {
    const index = this.availableComputerMoves.findIndex(([r, c]) => r === row && c === col)
    if (index !== -1) {
      this.availableComputerMoves.splice(index, 1);
    }
  }
}