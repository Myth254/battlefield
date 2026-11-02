import Ship from '../modules/ship';

describe('Ship', () => {
  test('stores the length it was created with', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
  })

  // Turn each todo into a real test, one at a time, then make it pass.
  // (test.todo shows up as "todo" in the Jest output so you can see progress.)
  test('starts with 0 hits', () => {
    const ship = new Ship(1)
    expect(ship.hits).toBe(0)
  })

  test('hit() increases the number of hits by 1', () => {
    const ship = new Ship(2)
    ship.hit()
    expect(ship.hits).toBe(1)
  })

  test('hit() can be called multiple times and keeps counting', () => {
    const ship = new Ship(2)
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.hits).toBe(3)
  })

  test('isSunk() is false for a brand new ship', () => {
    const ship = new Ship(3)
    expect(ship.isSunk()).toBe(false)
  })

  test('isSunk() is false when hits are fewer than length', () => {
    const ship = new Ship(3)
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(false)
  })

  test('isSunk() is true when hits equal length', () => {
    const ship = new Ship(3)
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(true)
  })
  
  test('a length-1 ship is sunk after a single hit', () => {
    const ship = new Ship(1)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
  });
});