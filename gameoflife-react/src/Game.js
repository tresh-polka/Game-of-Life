import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Cell extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.x !== nextProps.x || this.props.y !== nextProps.y;
  }

  render() {
    const { x, y } = this.props;
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * x + 1}px`,
          top: `${CELL_SIZE * y + 1}px`,
          width: `${CELL_SIZE - 1}px`,
          height: `${CELL_SIZE - 1}px`,
        }}
      />
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.state = {
      cells: [],
      isRunning: false,
      interval: 100,
      generation: 0,
    };
    this.timeoutHandler = null;
  }

  componentWillUnmount() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }
  }

  makeEmptyBoard() {
    const board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  makeCellsFromBoard() {
    const cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
        if (board[ny][nx]) neighbors++;
      }
    }
    return neighbors;
  }

  runIteration = () => {
    const newBoard = this.makeEmptyBoard();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.calculateNeighbors(this.board, x, y);
        const isAlive = this.board[y][x];

        if (isAlive) {
          newBoard[y][x] = (neighbors === 2 || neighbors === 3);
        } else {
          newBoard[y][x] = (neighbors === 3);
        }
      }
    }

    this.board = newBoard;
    this.setState((prevState) => ({
      cells: this.makeCellsFromBoard(),
      generation: prevState.generation + 1,
    }));

    if (this.state.isRunning) {
      this.timeoutHandler = setTimeout(this.runIteration, this.state.interval);
    }
  };

  runGame = () => {
    if (this.state.isRunning) return;
    this.setState({ isRunning: true });
    this.timeoutHandler = setTimeout(this.runIteration, this.state.interval);
  };

  stopGame = () => {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
    this.setState({ isRunning: false });
  };

  clearBoard = () => {
    this.stopGame();
    this.board = this.makeEmptyBoard();
    this.setState({
      cells: [],
      generation: 0,
    });
  };

  randomBoard = () => {
    this.stopGame();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = Math.random() < 0.2;
      }
    }
    this.setState({
      cells: this.makeCellsFromBoard(),
      generation: 0,
    });
  };

  handleIntervalChange = (event) => {
    const newInterval = Number(event.target.value);
    this.setState({ interval: newInterval });
    if (this.state.isRunning) {
      this.stopGame();
      this.runGame();
    }
  };

  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      this.board[y][x] = !this.board[y][x];
      this.setState({
        cells: this.makeCellsFromBoard(),
        generation: 0,
      });
    }
  };

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }

  render() {
    const { cells, isRunning, interval, generation } = this.state;

    return (
      <div>
        <div
          className="Board"
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
          onClick={this.handleClick}
          ref={(n) => { this.boardRef = n; }}
        >
          {cells.map(cell => (
            <Cell
              x={cell.x}
              y={cell.y}
              key={`${cell.x},${cell.y}`}
            />
          ))}
        </div>

        <div className="controls">
          <span>Generation: {generation}</span>
          <label>
            Interval (ms):
            <input
              type="number"
              value={interval}
              onChange={this.handleIntervalChange}
              min="20"
              max="1000"
              step="10"
            />
          </label>
          {isRunning ? (
            <button className="button" onClick={this.stopGame}>Stop</button>
          ) : (
            <button className="button" onClick={this.runGame}>Run</button>
          )}
          <button className="button" onClick={this.clearBoard}>Clear</button>
          <button className="button" onClick={this.randomBoard}>Random</button>
        </div>
      </div>
    );
  }
}

export default Game;
