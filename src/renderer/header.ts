import * as $ from 'jquery';
import * as feather from 'feather-icons';

export class Header {
  canvas: JQuery<Element>;
  $logo: JQuery<Element>;
  classNames = {
    header: 'header',
    logo: 'logo'
  };

  constructor() {
    let canvas = $('<header />');

    this.generateLogo();
    canvas
      .addClass(this.classNames.header)
      .append(this.$logo);
    this.canvas = canvas;
  }

  generateLogo() {
    const icon = feather.icons.moon.toSvg();
    this.$logo = $('<div>')
      .addClass(this.classNames.logo)
      .append(icon);
  }
}