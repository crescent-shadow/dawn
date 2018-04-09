/**
 * @fileOverview Timer Class.
 */

import * as $ from 'jquery';

export class Timer {
  public value: number = 0;
  public canvas: JQuery<Element>;
  private classNames: { timer: string } = {
    timer: 'status-timer'
  };
  private timerId: number;

  constructor() {
    this.canvas = $('<div>').addClass(this.classNames.timer);
  }

  public reset(): void {
    this.value = 0;
    this.stop();
    this.canvas.empty();
  }

  public stop(): void {
    clearTimeout(this.timerId);
  }

  public tick(): void {
    if (this.value >= Number.MAX_VALUE) {
      this.canvas.html('--:--');

      return;
    }
    this.value += 1;
    this.canvas.html(this.display());
    this.timerId = setTimeout(this.tick.bind(this), 1000);
  }

  public display(): string {
    const m: number = Math.floor((this.value % 3600) / 60);
    const s: number = Math.max(Math.floor((this.value % 3600) % 60), 0);
    const seconds: string = s < 10 ? `0${s.toString()}` : s.toString();

    return `${m.toString()}:${seconds}`;
  }
}
