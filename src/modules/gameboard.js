import Ship from './ship';

// A Gameboard owns a grid, the ships on it, and the record of missed shots.
// It never touches the DOM.
//
// Suggested API (change it if you like - but change the tests first):
//   placeShip(length, [row, col], direction)  direction: 'horizontal' | 'vertical'
//   receiveAttack([row, col])                 -> tells you what happened
//   missedAttacks                             -> list of [row, col] misses
//   allShipsSunk()                            -> boolean

export default class Gameboard {
  constructor(size = 10) {
    this.size = size
    // 2D grid filled with null
    this.grid = Array.from({ length: this.size }, () =>  Array(this.size).fill(null))
     // Set of "row,col" strings to track missed shots
    this.misses = new Set()
    this.hits = new Set()
    // Keep a tracking set of unique ships for quick game-over checks
    this.allShips = new Set()
  }

  placeShip(length, [row, col], direction = 'horizontal') {
    // Think about: out-of-bounds placement, overlapping another ship.
    const coordinates = []

    // 1. Calculate all coordinates the ship will occupy
    for (let i = 0; i < length; i++) {
      const r = direction === 'vertical' ? row + i : row
      const c = direction === 'horizontal' ? col + i : col
      coordinates.push([r, c])
    }

    // 2. Validate all coordinates against the tests
    for (const [r, c] of coordinates) {
      // Rejects a ship that goes off the bottom edge (r >= size) or right edge (c >= size)
      // Also handles negative bounds just in case (r < 0 || c < 0)
      if (r < 0 || r >= this.size || c < 0 || c >= this.size) {
        return false // or throw new Error("Out of bounds")
      }

      // Rejects a ship overlapping another ship
      if (this.grid[r][c] !== null) {
        return false // or throw new Error("Overlap detected")
      }
    }

    // 3. Valdation passed! Create the ship and occupy the squares
    const ship = new Ship(length)
    for (const [r, c] of coordinates) {
      this.grid[r][c] = ship
    }

    // Keep track of the ship object for tracking updates later
    this.allShips.add(ship)
    return true
  }

  receiveAttack(row, col) {
    //1. Ensure attack is inside bounds
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return false;
    }

    const coordKey = `${row},${col}`
    const target = this.grid[row][col]

    if (target !== null) {
      if (this.hits.has(coordKey)) {
        return true
      }

      this.hits.add(coordKey)
      target.hit()
      return true
    }

    this.misses.add(coordKey)
    return false
  }

  get missedAttacks() {
    return Array.from(this.misses)
  }

  allShipsSunk() {
    return Array.from(this.allShips).every((ship) => ship.isSunk())
  }
}