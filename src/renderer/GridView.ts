/**
 * @fileOverview GridView Class.
 */

import * as $ from 'jquery';
import { Howl } from 'howler';
import anime = require('animejs');
import { Cell } from './Cell';
import { Events } from './Events';
import { IMode } from './typings/mode.interface';
import { GridViewHeader } from './GridViewHeader';

const sfxForCellPath = require('./assets/audios/cell_reveal.mp3');
const sfxForFlagPath = require('./assets/audios/cell_flag.mp3');
const sfxForFlagRemovePath = require('./assets/audios/cell_flag_remove.mp3');

export class GridView {
  public canvas: JQuery<Element>;
  readonly mode: IMode;
  private rows: number;
  private cols: number;
  private mines: number;
  private minesFound: number;
  private cellsRevealed: number;
  private cells: Cell[][] = [];
  private cellsMine: Cell[];
  private cellElements: JQuery<Element>[] = [];
  private cellsClassName: string = 'cells';
  private cellClassName: string = 'cell';
  private readonly header: GridViewHeader;

  private className: string = 'grid-view';

  private sfxForCell: Howl = new Howl({ src: [sfxForCellPath] });
  private sfxForFlag: Howl = new Howl({ src: [sfxForFlagPath] });
  private sfxForFlagRemove: Howl = new Howl({ src: [sfxForFlagRemovePath] });

  constructor(mode: IMode) {
    const canvas: JQuery = $('<div/>');

    this.header = new GridViewHeader();

    canvas.addClass(this.className);
    this.canvas = canvas;
    this.mode = mode;
    this.init(mode);
  }

  public init(mode: IMode): void {
    this.header.init(mode);

    this.rows = mode.rows;
    this.cols = mode.cols;
    this.mines = mode.mines;
    this.minesFound = 0;
    this.cellsRevealed = 0;
    this.cellsMine = [];
    this.generateCells();
    this.generateMines();
  }

  public render(): void {
    const cellsElement: JQuery = $('<div>')
      .addClass(`${this.cellsClassName}`)
      .append(this.cellElements);
    const body: JQuery<Element> = $('<div>')
      .addClass('grid-view-body')
      .append(cellsElement);
    this.canvas
      .append(this.header.canvas)
      .append(body)
      .on('contextmenu', `.${this.cellClassName}`, (event: JQuery.Event) => {
        this.onCellFlag(event);
      })
      .on('click', `.${this.cellClassName}`, (event: JQuery.Event) => {
        this.onCellReveal(event);
      });
    this.setCanvasWidth();
    this.cellsMotion();
  }

  public freeze(success: boolean): void {
    this.canvas.off('click contextmenu');
    if (success) {
      this.canvas.addClass('grid-view-success');
      this.header.success();
    } else {
      this.canvas.addClass('grid-view-fail');
      this.header.fail();
    }
  }

  public destroy(): void {
    this.canvas.remove();
  }

  public expose(): { mode: IMode, cells: Cell[][] } {
    return { mode: this.mode, cells: this.cells };
  }

  private setCanvasWidth(): void {
    const cellsWidth: number = (20 + 2) * this.cols;
    let viewWidth = cellsWidth + 20 * 2;
    viewWidth = viewWidth < 320 ? 360 : viewWidth;

    this.setCellsWidth(cellsWidth);
    this.canvas.width(viewWidth);
  }

  private setCellsWidth(width: number): void {
    this.canvas
      .find(`.${this.cellsClassName}`)
      .width(width);
  }

  private onCellFlag(event: JQuery.Event): void {
    const element: JQuery = $(event.currentTarget);
    const cell: Cell = element.data('cell');

    if (cell.isRevealed) {
      return;
    }

    if (cell.isFlagged) {
      this.sfxForFlagRemove.play();
      cell.flag(false);
      this.minesFound -= 1
    } else {
      this.sfxForFlag.play();
      cell.flag(true);
      this.minesFound += 1
    }

    this.header.updateState(this.minesFound);
  }

  private onCellReveal(event: JQuery.Event): void {
    const element: JQuery = $(event.currentTarget);
    const cell: Cell = element.data('cell');

    if (cell.isRevealed) {
      return;
    }

    this.sfxForCell.play();

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
        $(document).trigger(Events.GAME_VICTORY, [
          this.mode,
          this.header.getTime()
        ]);
      }
    }
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
      this.header.updateState(this.minesFound);
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
      targets: `.${this.cellClassName}`,
      opacity: [0, 1],
      translateY: { value: [-20, 0] },
      delay: (target, index) => index,
      duration: 1000
    })
  }
}
