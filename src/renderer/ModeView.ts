/**
 * @fileOverview ModeView Class.
 */

import * as $ from 'jquery';
import { ModeViewHeader } from './ModeViewHeader';
import { ModeViewBody } from './ModeViewBody';

export class ModeView {
  public canvas: JQuery<Element>;
  private canvasClassName: string = 'mode-view';
  private header = new ModeViewHeader();
  private body = new ModeViewBody();

  constructor() {
    this.canvas = $('<div>')
      .addClass(this.canvasClassName)
      .append(this.header.canvas)
      .append(this.body.canvas);
  }

  public destroy(): void {
    this.canvas.remove();
  }

  public render(): void {
    this.canvas.show();
    this.header.doMotion();
    this.body.doMotions();
  }
}
