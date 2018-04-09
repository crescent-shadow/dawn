/**
 * @fileOverview Header Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';

export class Header {
  public canvas: JQuery<Element>;
  public $logo: JQuery<Element>;
  public classNames: { header: string; logo: string } = {
    header: 'header',
    logo: 'logo'
  };

  constructor() {
    const canvas: JQuery = $('<header />');

    this.generateLogo();
    canvas
      .addClass(this.classNames.header)
      .append(this.$logo);
    this.canvas = canvas;
  }

  private generateLogo(): void {
    const icon: string = feather.icons.moon.toSvg();
    this.$logo = $('<div>')
      .addClass(this.classNames.logo)
      .append(icon);
  }
}
