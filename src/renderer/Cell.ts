/**
 * @fileOverview Cell class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import anime = require('animejs');

export class Cell {
  public element: JQuery;
  public row: number;
  public col: number;
  public value: number = 0;
  public isMine: boolean = false;
  public isRevealed: boolean = false;
  public isFlagged: boolean = false;
  public classNames: {
    cell: string;
    reveal: string;
    flag: string;
    mine: string;
  } = {
    cell: 'cell',
    reveal: 'reveal',
    flag: 'flag',
    mine: 'mine'
  };

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.element = $('<span />')
        .addClass(this.classNames.cell)
        .data('cell', this);
  }

  public isEmpty(): boolean {
    return this.value === 0;
  }

  public reveal(): void {
    const value: string = this.value > 0 ? this.value.toString() : '';

    this.isRevealed = true;
    this.element
      .html(value)
      .addClass(this.classNames.reveal);
    this.cellRevealMotion();
  }

  public flag(toggle: boolean): void {
    const flagIcon: string = feather.icons.flag.toSvg();
    this.isFlagged = toggle;

    if (this.isFlagged) {
      this.element
        .addClass(this.classNames.flag)
        .html(flagIcon);
      this.cellFlagMotion();
    } else {
      this.element
        .removeClass(this.classNames.flag)
        .html('');
    }
  }

  public mine(): void {
    const mineIcon: string = this.isFlagged ?
      feather.icons['check-circle'].toSvg() :
      feather.icons['x-circle'].toSvg();
    this.element
      .addClass(this.classNames.mine)
      .html(mineIcon);
    this.cellMineMotion();
  }

  private cellRevealMotion(): void {
    anime({
      targets: this.element.get(0),
      backgroundColor: ['#7FDBFF', '#787878'],
      easing: 'linear',
      duration: 100
    });
  }

  private cellFlagMotion(): void {
    anime({
      targets: [
        this.element.find('path')[0],
        this.element.find('line')[0],
      ],
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 300
    });
  }

  private cellMineMotion(): void {
    anime({
      targets: [
        this.element.find('circle')[0]
      ].concat(this.element.find('line').get()),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 300
    });
  }
}
