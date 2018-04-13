/**
 * @fileOverview Back to Home button component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Events } from '../Events';

export class HomeButton {
  public canvas: JQuery<Element> = $('<button>');

  constructor() {
    const label: JQuery = $('<span>HOME</span>');
    const icon: string = feather.icons['arrow-left'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-home')
      .on('click', () => {
        $(document).trigger(Events.GAME_NEW);
      });
  }

  public show(): void {
    this.canvas.css({ opacity: 1, left: -90, zIndex: 1 });
  }

  public hide(): void {
    this.canvas.css({ opacity: 0, left: 0, zIndex: -1 });
  }
}
