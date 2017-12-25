import * as $ from 'jquery';

const ICON_LOGO = require('../assets/feather/moon.svg');

export class Header {
  canvas: JQuery<Element>;
  $logo: JQuery<Element>;
  classNames = {
    root: 'header'
  };

  constructor() {
    let canvas = $('<header />');

    this.generateLogo();
    canvas
      .addClass(this.classNames.root)
      .append(this.$logo);
    this.canvas = canvas;
  }

  generateLogo() {
    this.$logo = $('<div>')
      .addClass('logo')
      .append(ICON_LOGO);
  }
}