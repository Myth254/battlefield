// A Ship knows its length, how many times it has been hit, and whether it sank.
// It knows NOTHING about coordinates or the board - that's the Gameboard's job.

export default class Ship {
  constructor(length) {
    this.length = length
    this.hits = 0
  }

  hit() {
    this.hits += 1
    return true
  }

  isSunk() {
    return this.hits >= this.length ? true : false
  }
}