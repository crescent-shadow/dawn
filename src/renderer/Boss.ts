/**
 * @fileOverview Boss
 */
import { Cell } from './Cell';
import { IMode } from './typings/mode.interface';


export class Boss {
  private mode: IMode;
  private cells: Cell[][];
  private nonMineCells: Cell[] = [];
  private mineCells: Cell[] = [];

  constructor() {
  }

  public know({ mode, cells }): void {
    this.mode = mode;
    this.cells = cells;

    for (let i = 0; i < this.mode.rows; i += 1) {
      for (let j = 0; j < this.mode.cols; j += 1) {
        const cell = this.cells[i][j];
        cell.isMine ?
          this.mineCells.push(cell) :
          this.nonMineCells.push(cell);
      }
    }
  }

  public success(): void {
    const length = this.nonMineCells.length - 1;

    for (let i = 0; i <= length; i += 1) {
      const index = Math.ceil(Math.random() * (length - i));
      const cell = this.nonMineCells[index];

      setTimeout(() => {
        cell.element.trigger('click');
      }, 100 * i);

      this.nonMineCells.splice(index, 1);
    }
  }

  public fail(): void {
    const index = Math.ceil(Math.random() * (this.mineCells.length - 1));
    const cell = this.mineCells[index];

    cell.element.trigger('click');
  }
}
