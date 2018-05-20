/**
 * @fileOverview History Button Component.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';

export class HistoryButton {
  public canvas: JQuery<Element> = $('<button>');
  private sfxPath = require('./assets/audios/btn_home.mp3');
  private sfx = new Howl({ src: [this.sfxPath] });

  constructor() {
    const label: JQuery<Element> = $('<span>HISTORY</span>');
    const icon: string = feather.icons['activity'].toSvg();

    this.canvas
      .append(icon)
      .append(label)
      .addClass('button-history')
      .on('click', () => this.onButtonClick());
  }

  private async onButtonClick(): Promise<void> {
    this.sfx.play();
    $(document).trigger(Events.GAME_HISTORY);
  }

}
