/**
 * @fileOverview Restart Button Component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';

export class GridViewHeaderRestartButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath: string = require('./assets/audios/btn_restart.mp3');
  private sfx: Howl = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery<Element> = $('<span>RESTART</span>');
    const icon: string = feather.icons['rotate-ccw'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-restart')
      .on('click', () => {
        this.sfx.play();
        $(document).trigger(Events.GAME_RESTART, [
          this.canvas.data('mode')
        ]);
      });
  }

  public show(): void {
    this.canvas.css({ opacity: 1, left: -91, zIndex: 1 });
  }

  public hide(): void {
    this.canvas.css({ opacity: 0, left: 0, zIndex: -1 });
  }
}
