# Game-of-Life

https://tresh-polka.github.io/Game-of-Life/

# Conway's Game of Life

An interactive implementation of Conway's Game of Life built with **React**. Watch cells evolve according to simple rules and create complex patterns.

## Features
- Click on the grid to draw cells
- Run / Pause the simulation
- Adjust animation speed (20–1000 ms per generation)
- Random board generator
- Clear board
- Generation counter

## Rules
1. Any live cell with **< 2** live neighbors dies (underpopulation)
2. Any live cell with **2 or 3** live neighbors lives on
3. Any live cell with **> 3** live neighbors dies (overpopulation)
4. Any dead cell with **exactly 3** live neighbors becomes alive (reproduction)

## Built With
- React (create-react-app)
- CSS3 (grid via linear-gradient)

## Getting Started
```bash
npm install
npm start
