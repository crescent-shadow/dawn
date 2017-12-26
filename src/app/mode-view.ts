import * as $ from 'jquery';
import * as feather from 'feather-icons';
import { Events } from './events';
import { Mode } from './typings/mode.interface';

export class ModeView {
  title: string = 'MODE SELECT';
  width: number = 320;
  canvas: JQuery<Element>;
  dataKey: string = 'mode';
  classNames = {
    root: 'mode-view',
    title: 'mode-view-title',
    selectorContainer: 'mode-selectors',
    selector: 'mode-selector'
  };

  modes: Mode[] = [
    { name: 'easy', rows: 8, cols: 8, mines: 10, icon: 'cloud' },
    { name: 'normal', rows: 16, cols: 16, mines: 40, icon: 'cloud-rain' },
    { name: 'hard', rows: 16, cols: 30, mines: 99, icon: 'cloud-snow' },
    { name: 'insane', rows: 24, cols: 30, mines: 200, icon: 'cloud-lightning' }
  ];

  constructor() {
    let canvas = $('<div/>');
    let selectorsElement = this.getSelectors();

    canvas
      .addClass(this.classNames.root)
      .append(selectorsElement)
      .on('click', `.${this.classNames.selector}`, (event) => {
        let element = $(event.currentTarget);
        $(document).trigger(Events.GAME_START, [
          element.data(this.dataKey)
        ]);
      })
      .hide();
    this.canvas = canvas;
  }

  getSelectors() {
    let container = $(`<div>`)
      .addClass(this.classNames.selectorContainer);
    let selectors = this.modes.map(mode => {
      return this.getSelector(mode);
    });

    container.append(selectors);
    return container;
  }

  getSelector(mode): JQuery<Element> {
    let button = $('<button />');
    let icon = feather.icons[mode.icon].toSvg();
    let label = $(`<span>${mode.name.toUpperCase()}</span>`);
    button
      .addClass(this.classNames.selector)
      .addClass(`${this.classNames.selector}-${mode.name}`)
      .data(this.dataKey, mode)
      .append(icon)
      .append(label);
    return button;
  }
}