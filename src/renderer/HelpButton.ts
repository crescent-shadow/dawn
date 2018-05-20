/**
 * @fileOverview Help Button Component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';

export class HelpButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath = require('./assets/audios/btn_home.mp3');
  private sfx = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery<Element> = $('<span>HELP</span>');
    const icon: string = feather.icons['help-circle'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-help')
      .on('click', () => this.onButtonClick());
  }

  private async onButtonClick(): Promise<void> {
    this.sfx.play();
    $(document).trigger(Events.GAME_HELP);
  }

}
