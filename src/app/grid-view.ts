import * as $ from "jquery";
import { Mode } from './typings/mode.interface';
import { Events } from './events';
import { Cell } from './cell';


export class GridView {
  canvas: JQuery<Element>;
  private className: string = 'grid';
  rows: number;
  cols: number;
  mines: number;
  minesFound: number;
  cellsRevealed: number;
  cells: Cell[][] = [];
  cellsMine: Cell[];
  cellElements: JQuery<Element>[] = [];

  constructor() {
    this.generateCanvas();
  }

  public init(mode: Mode) {
    this.clear();

    this.rows = mode.rows;
    this.cols = mode.rows;
    this.mines = mode.mines;
    this.minesFound = 0;
    this.cellsRevealed = 0;
    this.cellsMine = [];
    this.generateCells();
    this.generateMines();
    this.render();
  }

  private generateCanvas() {
    let canvas = $('<div/>');

    canvas.addClass(this.className);
    this.canvas = canvas;
  }

  private generateCells() {
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = [];

      for (let j = 0; j < this.cols; j++) {
        let cell = new Cell(i, j);
        this.cells[i][j] = cell;
        this.cellElements.push(cell.element);
      }
    }
  }

  private generateMines() {
    for (let i = 0; i < this.mines; i++) {
      this.generateMine();
    }
  }

  private generateMine() {
    let x = Math.ceil(Math.random() * (this.rows - 1));
    let y = Math.ceil(Math.random() * (this.cols - 1));

    let cell = this.cells[x][y];

    if (cell.isMine) {
      this.generateMine();
    } else {
      cell.isMine = true;
      let neighbours = this.getNeighbours(cell);
      neighbours.forEach(neighbour => {
        neighbour.value += 1;
      });
      this.cellsMine.push(cell);
    }
  }

  render() {
    this.canvas
      .append(this.cellElements)
      .width((20 + 2) * this.cols)
      .on('contextmenu', '.cell', event => {
        let element = $(event.target);
        let cell = element.data('cell');

        cell.flag(!cell.isFlagged);
        cell.isFlagged ? this.minesFound++ : this.minesFound--;
        $(document).trigger(Events.GAME_UPDATE, [
          this.minesFound
        ]);
      })
      .on('click', '.cell', event => {
        let element = $(event.target);
        let cell = element.data('cell');

        if (cell.isMine) {
          this.RevealMines();
          $(document).trigger(Events.GAME_DEFEAT);
        } else {
          cell.reveal();
          this.cellsRevealed++;
          this.flood(cell);

          if (this.isCompleted()) {
            this.RevealMines();
            $(document).trigger(Events.GAME_VICTORY);
          }
        }
      });
  }

  freeze() {
    this.canvas.off('click contextmenu');
  }

  clear() {
    this.cells = [];
    this.cellElements = [];
    this.canvas.empty();
    this.canvas.off('click contextmenu');
  }

  private isCompleted() {
    let totalCells = this.rows * this.cols;

    return totalCells === this.mines + this.cellsRevealed;
  }

  private flood(cell: Cell) {
    let neighbours = this.getNeighbours(cell);
    neighbours.forEach(neighbour => {
      if (!neighbour.isMine &&
        !neighbour.isRevealed && neighbour.value === 0) {
        neighbour.reveal();
        this.cellsRevealed++;
        this.flood(neighbour);
      }
    });
  }

  private getNeighbours(cell: Cell) {
    // Eight-way
    const positions = [
      { row: cell.row - 1, col: cell.col - 1 },
      { row: cell.row - 1, col: cell.col },
      { row: cell.row - 1, col: cell.col + 1 },

      { row: cell.row, col: cell.col - 1 },
      { row: cell.row, col: cell.col + 1 },

      { row: cell.row + 1, col: cell.col - 1 },
      { row: cell.row + 1, col: cell.col },
      { row: cell.row + 1, col: cell.col + 1 }
    ];
    const neighbours: Cell[] = [];

    positions.forEach(position => {
      let neighbour = this.getCell(position.row, position.col);

      if (neighbour) {
        neighbours.push(neighbour);
      }
    });

    return neighbours;
  }

  private getCell(row, col) {
    if (this.cells[row]) {
      return this.cells[row][col];
    }
  }

  private RevealMines() {
    this.cellsMine.forEach(cell => {
      cell.mine();
    });
  }

}