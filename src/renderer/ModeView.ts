/**
 * @fileOverview ModeView Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';
import { ModeService } from './ModeService';
import { IMode } from './typings/mode.interface';
const sfxForModeSelectPath: string = require('./assets/audios/btn_mode_select.mp3');
const sfxForModeHoverPath: string = require('./assets/audios/btn_mode_hover.mp3');

export class ModeView {
  public title: string = 'MODE SELECT';
  public width: number = 320;
  public canvas: JQuery<Element>;
  public dataKey: string = 'mode';
  public classNames: {
    root: string;
    title: string;
    selectorContainer: string;
    selector: string;
  } = {
    root: 'mode-view',
    title: 'mode-view-title',
    selectorContainer: 'mode-selectors',
    selector: 'mode-selector'
  };
  private modeService: ModeService;
  private sfxForModeSelect = new Howl({ src: [sfxForModeSelectPath] });
  private sfxForModeHover = new Howl({ src: [sfxForModeHoverPath], volume: 0.3 });

  constructor() {
    this.modeService = new ModeService();

    const canvas: JQuery = $('<div/>');
    const selectorsElement: JQuery<Element> = this.getSelectors();

    canvas
      .addClass(this.classNames.root)
      .append(selectorsElement)
      .on('click', `.${this.classNames.selector}`, (event: JQuery.Event) => {
        this.sfxForModeSelect.play();
        this.selectMode(event);
      })
      .hide();
    this.canvas = canvas;
  }

  public getSelectors(): JQuery<Element> {
    const container: JQuery = $('<div>')
      .addClass(this.classNames.selectorContainer);
    const selectors: JQuery<Element>[] = this.modeService.items
      .map((mode: IMode) => {
        return this.getSelector(mode);
      });
    container.append(selectors);

    return container;
  }

  public getSelector(mode: IMode): JQuery<Element> {
    const button: JQuery = $('<button />');
    const icon: string = feather.icons[mode.icon].toSvg();
    const label: JQuery = $(`<span>${mode.name.toUpperCase()}</span>`);
    button
      .addClass(this.classNames.selector)
      .addClass(`${this.classNames.selector}-${mode.name}`)
      .data(this.dataKey, mode)
      .append(icon)
      .append(label)
      .on('mouseenter', () => {
        this.sfxForModeHover.play();
      });

    return button;
  }

  private selectMode(event: JQuery.Event) {
    const element: JQuery = $(event.currentTarget);
    $(document).trigger(Events.GAME_START, [
      element.data(this.dataKey)
    ]);
  }
}
