/**
 * @fileOverview HistoryView Class.
 */

import * as $ from 'jquery';
import { HistoryViewHeader } from './HistoryViewHeader';
import { HistoryViewBody } from './HistoryViewBody';

export class HistoryView {
  public canvas: JQuery<Element>;
  private className: string = 'history-view view';

  private header: HistoryViewHeader = new HistoryViewHeader();
  private body: HistoryViewBody = new HistoryViewBody();

  constructor() {
    this.canvas = $('<div>')
      .addClass(this.className)
      .append(this.header.canvas)
      .append(this.body.canvas);
  }

  public destroy(): void {
    this.canvas.remove();
  }

  public render(): void {
    this.body.render();
    this.canvas.show();
    this.header.doMotion();
  }
}
