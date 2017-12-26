import * as $ from 'jquery';

export class Timer {
  public value: number = 0;
  public canvas: JQuery<Element>;
  private classNames: any = {
    timer: 'status-timer'
  };
  private timerId;

  constructor() {
    this.canvas = $('<div>').addClass(this.classNames.timer);
  }

  reset() {
    this.value = 0;
    this.stop();
    this.canvas.empty();
  }

  stop() {
    clearTimeout(this.timerId);
  }

  tick() {
    if (this.value >= Number.MAX_VALUE) {
      this.canvas.html('--:--');
      return;
    }
    this.value++;
    this.canvas.html(this.display());
    this.timerId = setTimeout(this.tick.bind(this), 1000);
  }

  display() {
    let m = Math.floor((this.value % 3600) / 60);
    let s = Math.max(Math.floor((this.value % 3600) % 60), 0);
    return m.toString() + ":" + (s < 10 ? "0" + s.toString() : s.toString());
  }
}