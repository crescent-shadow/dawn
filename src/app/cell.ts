import * as $ from 'jquery';
import * as feather from 'feather-icons';

export class Cell {
  element: JQuery<HTMLElement>;
  row: number;
  col: number;
  value: number = 0;
  isMine: boolean = false;
  isRevealed: boolean = false;
  isFlagged: boolean = false;
  classNames: any = {
    cell: 'cell',
    reveal: 'reveal',
    flag: 'flag',
    mine: 'mine'
  };

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.element = $('<span />')
        .addClass(this.classNames.cell)
        .data('cell', this);
  }

  reveal() {
    let value = this.value > 0 ? this.value.toString() : '';

    this.isRevealed = true;
    this.element
      .html(value)
      .addClass(this.classNames.reveal);
  }

  flag(toggle) {
    const flagIcon = feather.icons.flag.toSvg();
    this.isFlagged = toggle;

    if (this.isFlagged) {
      this.element
        .addClass(this.classNames.flag)
        .html(flagIcon);
    } else {
      this.element
        .removeClass(this.classNames.flag)
        .html('');
    }
  }

  mine() {
    const mineIcon = feather.icons['x-circle'].toSvg();
    this.element
      .addClass(this.classNames.mine)
      .html(mineIcon);
  }
}