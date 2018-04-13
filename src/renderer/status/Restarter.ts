/**
 * @fileOverview Restarter Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Events } from '../Events';

export class Restarter {
  public canvas: JQuery<Element> = $('<button>');

  constructor() {
    const label: JQuery = $('<span>RESTART</span>');
    const icon: string = feather.icons['rotate-ccw'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-restart')
      .on('click', () => {
        $(document).trigger(Events.GAME_RESTART, [
          this.canvas.data('mode')
        ]);
      });
  }

  public show(): void {
    this.canvas.css({ opacity: 1, left: -90, zIndex: 1 });
  }

  public hide(): void {
    this.canvas.css({ opacity: 0, left: 0, zIndex: -1 });
  }
}
