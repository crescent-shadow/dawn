import * as $ from 'jquery';
import { Events } from './events';
import { Mode } from './typings/mode.interface';

export class ModeView {
  canvas: JQuery<Element>;
  classNames = {
    root: 'mode-view',
    selector: 'selector'
  };

  modes: Mode[] = [
    { name: 'easy', rows: 8, cols: 8, mines: 10 },
    { name: 'normal', rows: 16, cols: 16, mines: 40 },
    { name: 'hard', rows: 16, cols: 30, mines: 99 },
    { name: 'insane', rows: 24, cols: 30, mines: 200 }
  ];

  constructor() {
    let canvas = $('<div/>');
    let selectors = this.modes.map(mode => {
      return this.selector(mode);
    });

    canvas
      .addClass(this.classNames.root)
      .append(selectors)
      .on('click', '.selector', (event) => {
        let element = $(event.target);
        $(document).trigger(Events.GAME_START, [
          element.data('mode')
        ])
      });
    this.canvas = canvas;
  }

  selector(mode): JQuery<Element> {
    let button = $('<button />');
    button
      .addClass(this.classNames.selector)
      .data('mode', mode)
      .html(mode.name.toUpperCase());
    return button;
  }
}