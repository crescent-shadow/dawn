/**
 * @fileOverview Fail View
 */
import anime = require('animejs');
import { ResultBaseView } from './ResultBaseView';

export class FailView extends ResultBaseView {
  private _time: string;
  private containerClassName: string = '.result-view';

  constructor() {
   super(
     'fail-view-container',
     'fail-view-buttons',
     'fail-view-home-button',
     'fail-view-try-again-button'
   );
  }

  set time(time) {
    this._time = time;
  }

  show() {
    anime({
      targets: this.containerClassName,
      opacity: [0, 1],
      scale: [0, 1],
      duration: 1000
    });
  }
}