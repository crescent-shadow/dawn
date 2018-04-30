/**
 * @fileOverview Back to Home button component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';

export class HomeButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath = require('./assets/audios/btn_home.mp3');
  private sfx = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery<Element> = $('<span>HOME</span>');
    const icon: string = feather.icons['menu'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-home')
      .on('click', () => this.onButtonClick());
  }

  private onButtonClick(): void {
    this.sfx.play();
    $(document).trigger(Events.GAME_SELECT_MODE);
  }
}
