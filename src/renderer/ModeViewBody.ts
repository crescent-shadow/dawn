/**
 * @fileOverview ModeViewBody Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import anime = require('animejs');
import { IMode } from './typings/mode.interface';
import { Events } from './Events';
import { ModeService } from './ModeService';

const sfxForModeSelectPath: string = require('./assets/audios/btn_mode_select.mp3');
const sfxForModeHoverPath: string = require('./assets/audios/btn_mode_hover.mp3');

export class ModeViewBody {
  public canvas: JQuery<Element> = $('<section>');
  readonly commonClassName: string = 'view-body';
  readonly specificClassName: string = 'mode-view-body';
  readonly modeSelectorsContainerClassName: string = 'mode-view-selectors';
  readonly modeSelectorClassName: string = 'mode-view-selector';
  readonly modeDataKey = 'mode';
  private modeService: ModeService;

  private sfxForModeSelect = new Howl({ src: [sfxForModeSelectPath] });
  private sfxForModeHover = new Howl({ src: [sfxForModeHoverPath], volume: 0.3 });

  constructor() {
    this.modeService = new ModeService();

    const selectorsElement: JQuery<Element> = this.getSelectors();

    this.canvas
      .addClass(this.commonClassName)
      .addClass(this.specificClassName)
      .append(selectorsElement)
      .on('click', `.${this.modeSelectorClassName} button`, (event: JQuery.Event) => {
        this.sfxForModeSelect.play();
        this.selectMode(event);
      });
  }

  public doMotions() {
    this.doSelectorsMotion();
  }

  private getSelectors(): JQuery<Element> {
    const container: JQuery = $('<div>')
      .addClass(this.modeSelectorsContainerClassName);
    const selectors: JQuery<Element>[] = this.modeService.items
      .map((mode: IMode) => this.getSelector(mode));
    container.append(selectors);

    return container;
  }

  private getSelector(mode: IMode): JQuery<Element> {
    const div: JQuery<Element> = $('<div>');
    const button: JQuery = $('<button />');
    const icon: string = feather.icons[mode.icon].toSvg();
    const label: JQuery = $(`<span>${mode.name.toUpperCase()}</span>`);

    button
      .data(this.modeDataKey, mode)
      .append(icon)
      .append(label)
      .on('mouseenter', () => {
        this.sfxForModeHover.play();
      });
    div
      .addClass(this.modeSelectorClassName)
      .addClass(`${this.modeSelectorClassName}-${mode.name}`)
      .append(button);

    return div;
  }

  private selectMode(event: JQuery.Event) {
    const element: JQuery = $(event.currentTarget);
    $(document).trigger(Events.GAME_START, [
      element.data(this.modeDataKey)
    ]);
  }

  private doSelectorsMotion() {
    anime({
      targets: `.${this.modeSelectorClassName}`,
      translateY: [-30, 0],
      opacity: [0, 1],
      delay: (el, index) => index * 50,
      easing: 'easeOutQuint'
    })
  }
}
