# Battleship

A browser-based Battleship game built with vanilla JavaScript as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.

The project uses test-driven development for the core game logic and Webpack to bundle the browser application.

## Features

- 10 x 10 player and enemy boards
- Four-ship fleet:
  - Carrier: 5 cells
  - Battleship: 4 cells
  - Destroyer: 3 cells
  - Patrol Boat: 2 cells
- Manual ship placement
- Horizontal and vertical ship orientation
- Placement validation for board boundaries and overlapping ships
- Random computer ship placement
- Turn-based attacks against the computer
- Computer attacks on a random unplayed square
- Hit and miss indicators
- Hidden enemy ships
- Victory and defeat status messages
- Game reset button

## Screenshots

### Ship placement

![Ship placement phase](./screenshots/Screenshot%20From%202026-11-02%2015-43-00.png)

### Active game

![Active Battleship game](./screenshots/Screenshot%20From%202026-11-02%2015-43-31.png)

## Requirements

- Node.js
- npm

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/Myth254/battlefield.git
   cd battlefield
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start
   ```

4. Open the local URL shown by Webpack, usually:

   ```text
   http://localhost:8080
   ```

## How to play

1. Place your Carrier, Battleship, Destroyer, and Patrol Boat on **Your Fleet**.
2. Click the orientation button to switch between horizontal and vertical placement.
3. Invalid placements are rejected when a ship is outside the board or overlaps another ship.
4. Once all ships are placed, click a square on **Enemy Waters** to attack.
5. Turns alternate between you and the computer.
6. Sink the entire enemy fleet to win.
7. Use **Reset Game** to start a new game.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run start` | Starts Webpack Dev Server in development mode |
| `npm run build` | Creates a production bundle in `dist/` |
| `npm test` | Runs the Jest test suite |
| `npm run test:watch` | Runs Jest in watch mode |

## Project structure

```text
.
├── src/
│   ├── index.js                 # Browser entry point
│   ├── styles.css               # Board and interface styling
│   ├── template.html            # HTML template
│   ├── modules/
│   │   ├── dom.js               # Rendering and DOM event handlers
│   │   ├── game.js              # Game flow and turn management
│   │   ├── gameboard.js         # Grid, ship placement, and attacks
│   │   ├── player.js            # Human and computer players
│   │   └── ship.js              # Ship state and sinking logic
│   └── tests/
│       ├── gameboard.test.js    # Gameboard behavior
│       ├── player.test.js       # Player behavior
│       └── ship.test.js         # Ship behavior
├── babel.config.js
├── package.json
└── webpack.config.js
```

## Architecture

- `Ship` tracks a ship's length and number of hits.
- `Gameboard` owns a grid, ships, hits, and misses. It validates placement and processes attacks.
- `Player` owns a gameboard and provides human and computer attack behavior.
- `game.js` coordinates setup, ship placement, turns, win/loss conditions, and resets.
- `dom.js` renders gameboards and connects UI events to the game controller.
- `index.js` loads the stylesheet and starts the game after the document is ready.

## Testing

The game logic is tested with Jest:

```bash
npm test
```

The tests cover ship behavior, board placement and attacks, player ownership, and computer move selection.

## Build

To create an optimized production bundle:

```bash
npm run build
```

Webpack writes the generated files to `dist/`.
