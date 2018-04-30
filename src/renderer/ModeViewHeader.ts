/**
 * @fileOverview ModeViewHeader Class.
 */

import * as $ from 'jquery';
import anime = require('animejs');

export class ModeViewHeader {
  public canvas: JQuery<Element>;
  private commonClassName: string = 'view-header';
  private specificClassName: string = 'mode-view-header';
  private titleClassName: string = 'mode-view-header-title';

  constructor() {
    this.canvas = $('<section>')
      .addClass(this.commonClassName)
      .addClass(this.specificClassName);
    const title: JQuery<Element> = this.getTitleNode();
    this.canvas.append(title);
  }

  public doMotion(): void {
    this.doTitleMotion();
  }

  private getTitleNode(): JQuery<Element> {
    return $('<span>')
      .addClass(this.titleClassName)
      .text('select mode');
  }

  private doTitleMotion(): void {
    anime({
      targets: `.${this.titleClassName}`,
      translateX: [-30, 0],
      opacity: [0, 1],
      easing: 'easeOutQuint'
    });
  }
}
