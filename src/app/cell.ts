import * as $ from 'jquery';

const ICON_FLAG = require('../assets/feather/flag.svg');
const ICON_MINE = require('../assets/feather/x-circle.svg');

export class Cell {
  element: JQuery<HTMLElement>;
  row: number;
  col: number;
  value: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.value = 0;
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.element = $('<span />').addClass('cell');
    this.element.data('cell', this);
  }

  reveal() {
    let value = this.value > 0 ? this.value.toString() : '';

    this.isRevealed = true;
    this.element
      .html(value)
      .addClass('reveal');
  }

  flag(toggle) {
    this.isFlagged = toggle;

    if (this.isFlagged) {
      this.element
        .addClass('flag')
        .html(ICON_FLAG);
    } else {
      this.element
        .removeClass('flag')
        .html('');
    }
  }

  mine() {
    this.element
      .addClass('mine')
      .html(ICON_MINE);
  }
}