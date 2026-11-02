import Player from '../modules/player.js';
import Gameboard from '../modules/gameboard.js'

describe('Player', () => {
  test('a player has a type of "human" or "computer"', () => {
    const human = new Player('human')
    const computer = new Player('computer')

    expect(human.type).toBe('human')
    expect(computer.type).toBe('computer')
  })

  test('each player has its own gameboard', () => {
    const player = new Player('human')
    expect(player.gameboard).toBeInstanceOf(Gameboard)
  })

  test('two players do not share the same gameboard', () => {
    const player1 = new Player('human');
    const player2 = new Player('human');

    expect(player1.gameboard).not.toBe(player2.gameboard)
  })

  test('a human player can attack the enemy board at chosen coordinates', () => {
    const human = new Player('human')
    const enemyBoard = new Player('computer')

    human.attack(enemyBoard, [3, 4])
    expect(enemyBoard.gameboard.missedAttacks).toContain('3,4')
  })

  test('a computer player attacks a legal square on the enemy board', () => {
    const computer = new Player('computer')
    const enemyBoard = new Player('human')

    computer.randomAttack(enemyBoard)
    expect(enemyBoard.gameboard.missedAttacks.length).toBe(1)
  })

  test('a computer player never attacks the same square twice', () => {
    const computer = new Player('computer')
    const enemyBoard = new Gameboard()

    // Fire 5 rapid automatic computer attacks
    for (let i = 0; i < 5; i++) {
      computer.attack(enemyBoard)
    }

    const uniqueMisses = new Set(enemyBoard.missedAttacks)

    expect(uniqueMisses.size).toBe(5)
  })

  test('a computer can fill an entire 10x10 board: 100 attacks, 100 unique squares', () => {
    const computer = new Player('computer')
    const enemyBoard = new Gameboard()

    // Completely saturate a 10x10 grid with computer turns
    for (let i = 0; i < 100; i++) {
      computer.attack(enemyBoard);
    }

    const totalAttacks = enemyBoard.missedAttacks
    const uniqueAttacks = new Set(totalAttacks)

    expect(totalAttacks.length).toBe(100)
    expect(uniqueAttacks.size).toBe(100)
  })
})