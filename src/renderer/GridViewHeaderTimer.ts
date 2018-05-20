/**
 * @fileOverview Timer Component.
 */

import * as $ from 'jquery';

export class GridViewHeaderTimer {
  private _value: number = 0;
  public canvas: JQuery<Element>;
  private canvasClassName: string = 'timer';
  private timerId: number;

  constructor() {
    this.canvas = $('<div>')
      .addClass(this.canvasClassName);
  }

  get value() {
    return this._value;
  }

  public reset(): void {
    this._value = 0;
    this.stop();
    this.canvas.empty();
  }

  public stop(): void {
    clearTimeout(this.timerId);
  }

  public tick(): void {
    if (this._value >= Number.MAX_VALUE) {
      this.canvas.html('--:--');

      return;
    }
    this._value += 1;
    this.canvas.html(this.display());
    this.timerId = setTimeout(this.tick.bind(this), 1000);
  }

  public display(): string {
    const zeroPadding = (number: number): string => {
      return number < 10 ? `0${number.toString()}` : number.toString();
    };
    const spanWrap = (number: string): string => {
      const parts = number.split('');
      return parts.map((part: string) => {
        return `<span>${part}</span>`;
      }).join('');
    };
    const m: number = Math.floor((this._value % 3600) / 60);
    const s: number = Math.max(Math.floor((this._value % 3600) % 60), 0);
    const minutes: string = spanWrap(zeroPadding(m));
    const seconds: string = spanWrap(zeroPadding(s));

    return `${minutes}:${seconds}`;
  }
}
