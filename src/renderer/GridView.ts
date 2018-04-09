/**
 * @fileOverview GridView Class.
 */

import * as $ from 'jquery';
import { Cell } from './Cell';
import { Events } from './events';
import { IMode } from './typings/mode.interface';

export class GridView {
  public title: string = '';
  public width: number = 320;
  public canvas: JQuery<Element>;
  public rows: number;
  public cols: number;
  public mines: number;
  public minesFound: number;
  public cellsRevealed: number;
  public cells: Cell[][] = [];
  public cellsMine: Cell[];
  public cellElements: JQuery<Element>[] = [];

  private className: string = 'grid-view';

  constructor() {
    this.generateCanvas();
  }

  public init(mode: IMode): void {
    this.clear();

    this.rows = mode.rows;
    this.cols = mode.rows;
    this.mines = mode.mines;
    this.minesFound = 0;
    this.cellsRevealed = 0;
    this.cellsMine = [];
    this.title = mode.name.toUpperCase();
    this.generateCells();
    this.generateMines();
    this.render();
  }

  public render(): void {
    const cellsWidth: number = (20 + 2) * this.cols;
    this.width = cellsWidth + 20 * 2;
    this.width = this.width < 320 ? 360 : this.width;
    const cellsElement: JQuery = $('<div>')
      .addClass('cells')
      .width(cellsWidth)
      .append(this.cellElements);
    this.canvas
      .append(cellsElement)
      .on('contextmenu', '.cell', (event: JQuery.Event) => {
        const element: JQuery = $(event.currentTarget);
        const cell: Cell = element.data('cell');

        cell.flag(!cell.isFlagged);
        cell.isFlagged ? this.minesFound += 1 : this.minesFound -= 1;
        $(document).trigger(Events.GAME_UPDATE, [
          this.minesFound
        ]);
      })
      .on('click', '.cell', (event: JQuery.Event) => {
        const element: JQuery = $(event.currentTarget);
        const cell: Cell = element.data('cell');

        if (cell.isMine) {
          this.revealMines();
          $(document).trigger(Events.GAME_DEFEAT);
        } else {
          cell.reveal();
          this.cellsRevealed += 1;
          this.flood(cell);

          if (this.isCompleted()) {
            this.revealMines();
            $(document).trigger(Events.GAME_VICTORY);
          }
        }
      });
  }

  public freeze(): void {
    this.canvas.off('click contextmenu');
  }

  public clear(): void {
    this.cells = [];
    this.cellElements = [];
    this.canvas.empty();
    this.canvas.off('click contextmenu');
    this.canvas.hide();
  }

  private generateCanvas(): void {
    const canvas: JQuery = $('<div/>');

    canvas
      .addClass(this.className)
      .hide();
    this.canvas = canvas;
  }

  private generateCells(): void {
    for (let i: number = 0; i < this.rows; i += 1) {
      this.cells[i] = [];

      for (let j: number = 0; j < this.cols; j += 1) {
        const cell: Cell = new Cell(i, j);
        this.cells[i][j] = cell;
        this.cellElements.push(cell.element);
      }
    }
  }

  private generateMines(): void {
    for (let i: number = 0; i < this.mines; i += 1) {
      this.generateMine();
    }
  }

  private generateMine(): void {
    const x: number = Math.ceil(Math.random() * (this.rows - 1));
    const y: number = Math.ceil(Math.random() * (this.cols - 1));

    const cell: Cell = this.cells[x][y];

    if (cell.isMine) {
      this.generateMine();
    } else {
      cell.isMine = true;
      const neighbours: Cell[] = this.getNeighbours(cell);
      neighbours.forEach((neighbour: Cell) => {
        neighbour.value += 1;
      });
      this.cellsMine.push(cell);
    }
  }

  private isCompleted(): boolean {
    const totalCells: number = this.rows * this.cols;

    return totalCells === this.mines + this.cellsRevealed;
  }

  private flood(cell: Cell): void {
    const neighbours: Cell[] = this.getNeighbours(cell);
    neighbours.forEach((neighbour: Cell) => {
      if (!neighbour.isMine &&
        !neighbour.isRevealed && neighbour.value === 0) {
        neighbour.reveal();
        this.cellsRevealed += 1;
        this.flood(neighbour);
      }
    });
  }

  private getNeighbours(cell: Cell): Cell[] {
    interface IPosition {
      row: number;
      col: number;
    }
    // Eight-way
    const positions: IPosition[] = [
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

    positions.forEach((position: IPosition) => {
      const neighbour: Cell = this.getCell(position.row, position.col);

      if (neighbour) {
        neighbours.push(neighbour);
      }
    });

    return neighbours;
  }

  private getCell(row: number, col: number): Cell | null {
    if (this.cells[row]) {
      return this.cells[row][col];
    }

    return null;
  }

  private revealMines(): void {
    this.cellsMine.forEach((cell: Cell) => {
      cell.mine();
    });
  }
}
