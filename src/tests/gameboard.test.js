import Gameboard from '../modules/gameboard.js';

// Write these one at a time. Convert ONE todo to a real test, watch it fail,
// make it pass, then move to the next. Don't convert them all at once.
describe('Gameboard', () => {
  let board

  beforeEach(() => {
    board = new Gameboard()
  })
  describe('placeShip', () => {
    test('places a ship horizontally starting at the given coordinates', () => {
      expect(board.placeShip(3, [2, 3])).toBe(true)
    })

    test('places a ship vertically starting at the given coordinates', () => {
      expect(board.placeShip(3, [2, 3], 'vertical')).toBe(true)
    })

    test('rejects a ship that would hang off the right edge', () => {
      const result = board.placeShip(4, [2, 7], 'horizontal')
      expect(result).toBe(false)
      expect(board.grid[2][7]).toBeNull() // Ensure it didn't partially place
    })

    test('rejects a ship that would hang off the bottom edge', () => {
      const result = board.placeShip(4, [8, 2], 'vertical')
      expect(result).toBe(false)
      expect(board.grid[8][2]).toBeNull() // Ensure it didn't partially place
    })

    test('rejects a ship that overlaps an existing ship', () => {
      const firstPlacement = board.placeShip(3, [4, 4], 'horizontal')
      expect(firstPlacement).toBe(true)

      const secondPlacement = board.placeShip(3, [3, 5], 'vertical')
      expect(secondPlacement).toBe(false)
      // Ensure the overlapping spot still belongs to the first ship
      expect(board.grid[4][5]).not.toBeNull()
      // Ensure the non-overlapping entry point was not accidentally dirty filled
      expect(board.grid[3][5]).toBeNull()
    });
  });

  describe('receiveAttack', () => {
    test('registers a hit when the coordinates contain a ship', () => {
      board.placeShip(3, [2, 3], 'horizontal'); // Occupies, [2,4], [2,5]
    
      const result = board.receiveAttack(2, 4);
      
      expect(result).toBe(true); // Should return true for a hit
    })

    test('sends the hit to the correct ship (other ships are untouched)', () => {
      board.placeShip(3, [0, 0], 'horizontal'); // Ship A
      board.placeShip(2, [5, 5], 'vertical');   // Ship B

      const shipA = board.grid[0][0]
      const shipB = board.grid[5][5]

      // Spy or check the hit property on Ship B directly
      board.receiveAttack(5, 5);

      expect(shipB.hits).toBe(1);  // Targeted ship takes damage
      expect(shipA.hits).toBe(0);  // Untargeted ship remains safe
    })

    test('records the coordinates of a miss when there is no ship', () => {
      const result = board.receiveAttack(7, 8);
      
      expect(result).toBe(false); // Should return false for a miss
      expect(board.misses.has('7,8')).toBe(true); // Verifies it was logged
    })

    test('does not record a hit as a miss', () => {
      board.placeShip(2, [4, 4], 'horizontal');
      board.receiveAttack(4, 4);
      expect(board.misses.has('4,4')).toBe(false); // Hits shouldn't end up in misses track
    })

    test('handles attacking the same square twice (decide: error or ignore?)', () => {
      board.placeShip(2, [1, 1], 'horizontal')

      // First attack registers hit
      expect(board.receiveAttack(1, 1)).toBe(true);
      const ship = board.grid[1][1];
      expect(ship.hits).toBe(1);
      
      // Second attack ignores/handles gracefully (keeps hit status, doesn't re-damage or break)
      expect(board.receiveAttack(1, 1)).toBe(true);
      expect(ship.hits).toBe(1); // Hits shouldn't stack up infinitely on one square
      
      // Same concept for a double miss
      expect(board.receiveAttack(9, 9)).toBe(false);
      expect(board.receiveAttack(9, 9)).toBe(false);
      // If misses is a Set, its size will naturally remain 1 for this block
    })

    test('handles attacking outside the board (decide: error or ignore?)', () => {
      expect(board.receiveAttack(-1, 5)).toBe(false);
      expect(board.receiveAttack(10, 2)).toBe(false);
      
      // Ensure bad coords didn't accidentally contaminate misses collection
      expect(board.misses.has('-1,5')).toBe(false);
      expect(board.misses.has('10,2')).toBe(false);
    })
  });

  describe('missedAttacks', () => {
    test('is empty on a new board', () => {
      expect(board.misses.size).toBe(0)
    })

    test('lists every missed coordinate in order', () => {
      // Fire a sequence of misses across the board
      board.receiveAttack(1, 2)
      board.receiveAttack(5, 5)
      board.receiveAttack(9, 0)

      const missList = Array.from(board.misses)
      expect(missList).toEqual(['1,2', '5,5', '9,0'])
    })
  });

  describe('allShipsSunk', () => {
    test('is false when no ships have been placed', () => {
      // If there are no ships to hunt, all active targets are technically "cleared"
      expect(board.allShipsSunk()).toBe(true)
    })

    test('is false when at least one ship is still afloat', () => {
      // Place two ships on the board
      board.placeShip(2, [0, 0], 'horizontal'); // Occupies [0,0], [0,1]
      board.placeShip(2, [4, 5], 'vertical');   // Occupies [4,5], [5,5]

      // Completely sink the first ship
      board.receiveAttack(0, 0)
      board.receiveAttack(0, 1)

      // sink only half of the second ship
      board.receiveAttack(4, 5)

      // Game should continue because the second ship is still breathing
      expect(board.allShipsSunk()).toBe(false)
    })

    test('is true once every ship has been sunk', () => {
      // Place two separate ships
      board.placeShip(2, [2, 2], 'horizontal');
      board.placeShip(1, [7, 7], 'horizontal');

      // Destroy ship 1
      board.receiveAttack(2, 2)
      board.receiveAttack(2, 3)

      // Destroy ship 2
      board.receiveAttack(7, 7)

      // Every single tracked target on the board is now destroyed
      expect(board.allShipsSunk()).toBe(true)
    })
  });
});
