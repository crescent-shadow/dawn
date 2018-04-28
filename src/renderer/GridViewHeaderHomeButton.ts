/**
 * @fileOverview Back to Home button component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';

export class GridViewHeaderHomeButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath = require('./assets/audios/btn_home.mp3');
  private sfx = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery = $('<span>HOME</span>');
    const icon: string = feather.icons['arrow-left'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-home')
      .on('click', () => {
        this.sfx.play();
        $(document).trigger(Events.GAME_NEW);
      });
  }

  public show(): void {
    this.canvas.css({ opacity: 1, left: -91, zIndex: 1 });
  }

  public hide(): void {
    this.canvas.css({ opacity: 0, left: 0, zIndex: -1 });
  }
}
