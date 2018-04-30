/**
 * @fileOverview Restart Button Component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';
import { IMode } from './typings/mode.interface';

export class RestartButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath: string = require('./assets/audios/btn_restart.mp3');
  private sfx: Howl = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery<Element> = $('<span>RESTART</span>');
    const icon: string = feather.icons['rotate-ccw'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .prop('disabled', true)
      .addClass('button-restart')
      .on('click', () => this.onButtonClick());
  }

  private onButtonClick(): void {
    this.sfx.play();
    $(document).trigger(Events.GAME_START, [
      this.canvas.data('mode')
    ]);
  }

  public activate(mode: IMode): void {
    this.canvas.data('mode', mode);
    this.canvas.prop('disabled', false);
  }

  public deactivate(): void {
    this.canvas.data('mode', null);
    this.canvas.prop('disabled', true);
  }
}
