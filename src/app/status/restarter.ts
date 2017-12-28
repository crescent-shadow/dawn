import * as $ from "jquery";
import * as feather from 'feather-icons';
import { Events } from '../events';

export class Restarter {
  canvas: JQuery<Element> = $('<button>');

  constructor() {
    const label = $(`<span>RESTART</span>`);
    const icon = feather.icons['arrow-left'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-restart')
      .on('click', () => {
        $(document).trigger(Events.GAME_NEW);
      });
  }

  show() {
    this.canvas.css({ left: -90, zIndex: 1 });
  }

  hide() {
    this.canvas.css({ left: 0, zIndex: -1 });
  }
}