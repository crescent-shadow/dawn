/**
 * @fileOverview HelpView Component.
 */

import * as $ from 'jquery';
import { HelpViewHeader } from './HelpViewHeader';
import { HelpViewBody } from './HelpViewBody';

export class HelpView {
  public canvas: JQuery<Element>;
  private readonly className: string = 'help-view view';

  private header: HelpViewHeader = new HelpViewHeader();
  private body: HelpViewBody = new HelpViewBody();

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
    this.canvas.show();
    this.header.doMotion();
  }

}
