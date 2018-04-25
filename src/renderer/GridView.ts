/**
 * @fileOverview GridView Class.
 */

import * as $ from 'jquery';
import { Howl } from 'howler';
import anime = require('animejs');
import { Cell } from './Cell';
import { Events } from './Events';
import { IMode } from './typings/mode.interface';

const sfxForCellPath = require('./assets/audios/cell_reveal.mp3');
const sfxForFlagPath = require('./assets/audios/cell_flag.mp3');
const sfxForFlagRemovePath = require('./assets/audios/cell_flag_remove.mp3');

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

  private sfxForCell: Howl = new Howl({ src: [sfxForCellPath] });
  private sfxForFlag: Howl = new Howl({ src: [sfxForFlagPath] });
  private sfxForFlagRemove: Howl = new Howl({ src: [sfxForFlagRemovePath] });

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
        this.onCellFlag(event);
      })
      .on('click', '.cell', (event: JQuery.Event) => {
        this.sfxForCell.play();
        this.onCellReveal(event);
      });
    this.cellsMotion();
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

  private onCellFlag(event: JQuery.Event): void {
    const element: JQuery = $(event.currentTarget);
    const cell: Cell = element.data('cell');

    if (cell.isFlagged) {
      this.sfxForFlagRemove.play();
      cell.flag(false);
      this.minesFound -= 1
    } else {
      this.sfxForFlag.play();
      cell.flag(true);
      this.minesFound += 1
    }

    $(document).trigger(Events.GAME_UPDATE, [
      this.minesFound
    ]);
  }

  private onCellReveal(event: JQuery.Event): void {
    const element: JQuery = $(event.currentTarget);
    const cell: Cell = element.data('cell');

    this.removeFlagWhenReveal(cell);

    if (cell.isMine) {
      this.revealMines();
      $(document).trigger(Events.GAME_DEFEAT);
    } else {
      cell.reveal();
      this.cellsRevealed += 1;

      if (cell.isEmpty()) {
        this.flood(cell);
      }

      if (this.isCompleted()) {
        this.flagRestMines();
        this.revealMines();
        $(document).trigger(Events.GAME_VICTORY);
      }
    }
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

  private removeFlagWhenReveal(cell: Cell) {
    if (cell.isFlagged) {
      cell.flag(false);
      this.minesFound -= 1;
      $(document).trigger(Events.GAME_UPDATE, [
        this.minesFound
      ]);
    }
  }

  private flood(cell: Cell): void {
    const neighbours: Cell[] = this.getNeighbours(cell);
    neighbours.forEach((neighbour: Cell) => {
      if (!neighbour.isMine && !neighbour.isRevealed && !neighbour.isFlagged) {
        neighbour.reveal();
        this.cellsRevealed += 1;

        if (neighbour.isEmpty()) {
          this.flood(neighbour);
        }
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

  private flagRestMines(): void {
    this.cellsMine
      .filter((cell: Cell) => {
        return !cell.isFlagged;
      })
      .map((cell: Cell) => {
        cell.flag(true);
      });
  }

  private revealMines(): void {
    this.cellsMine.forEach((cell: Cell) => {
      cell.mine();
    });
  }

  private cellsMotion(): void {
    anime({
      targets: '.cell',
      opacity: [0, 1],
      translateY: { value: [-20, 0] },
      delay: (target, index) => index,
      duration: 1000
    })
  }
}
