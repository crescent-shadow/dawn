import * as $ from 'jquery';
import * as feather from 'feather-icons';
import { Events } from './events';
import { ResultsEnum } from './results.enum';
import { Timer } from './timer';

interface StateElements {
  root?: JQuery<Element>;
  found?: JQuery<Element>;
  total?: JQuery<Element>;
}

export class Status {
  canvas: JQuery<Element> = $('<div>');
  $mode: JQuery<Element>;
  $result: JQuery<Element>;
  timer: Timer;
  $restartButton: JQuery<Element>;
  stateElements: StateElements = {};

  constructor() {
    this.timer = new Timer();
    this.generateModeElement();
    this.generateRestartButton();
    this.generateResultElement();
    this.generateStatesElements();
    this.canvas
      .addClass('status')
      .append(this.$restartButton)
      .append(this.$mode)
      .append(this.$result)
      .append(this.timer.canvas)
      .append(this.stateElements.root);
  }

  reset() {
    this.hideState();
    this.toggleRestartButton(false);
    this.updateResult();
    this.timer.reset();
  }

  init(mines) {
    this.initState(mines);
    this.toggleRestartButton(true);
    this.updateResult(ResultsEnum.InProgress);
    this.timer.tick();
  }

  generateModeElement() {
    this.$mode = $('<div>').addClass('status-mode');
  }

  generateRestartButton() {
    const label = $(`<span>Restart</span>`);
    const icon = feather.icons['rotate-cw'].toSvg();

    this.$restartButton = $('<button>')
      .append(icon)
      .append(label)
      .addClass('button-restart')
      .on('click', () => {
        $(document).trigger(Events.GAME_NEW);
      });
  }

  toggleRestartButton(toShow: boolean) {
    toShow ?
      this.$restartButton.css({ left: -90, zIndex: 1 }) :
      this.$restartButton.css({ left: 0, zIndex: -1 });
  }

  generateResultElement() {
    this.$result = $('<div>')
      .addClass('status-result');
  }

  updateResult(result?: number) {
    const iconInProgress = feather.icons.circle.toSvg();
    const iconVictory = feather.icons['check-circle'].toSvg();
    const iconDefeat = feather.icons['x-circle'].toSvg();

    this.$result
      .empty()
      .removeClass('status-result-in-progress')
      .removeClass('status-result-victory')
      .removeClass('status-result-defeat');

    switch (result) {
      case ResultsEnum.InProgress:
        this.$result
          .addClass('status-result-in-progress')
          .append(iconInProgress);
        break;
      case ResultsEnum.Victory:
        this.$result
          .addClass('status-result-victory')
          .append(iconVictory)
          .append(' Victory');
        break;
      case ResultsEnum.Defeat:
        this.$result
          .addClass('status-result-defeat')
          .append(iconDefeat)
          .append(' Defeat');
        break;
    }
  }

  generateStatesElements() {
    const stateClass = 'main-header-state';
    let $stateRoot = $('<div>').addClass('status-state');
    let $stateFound = $('<span>').addClass(stateClass + '-found');
    let $stateTotal = $('<span>').addClass(stateClass + '-total');

    this.stateElements.root = $stateRoot;
    this.stateElements.found = $stateFound;
    this.stateElements.total = $stateTotal;

    $stateRoot
      .hide()
      .append($stateFound)
      .append(' OF ')
      .append($stateTotal)
      .append(' MINES');
  }

  updateMode(modeLabel: string) {
    this.$mode.html(modeLabel);
  }

  initState(total: number) {
    this.stateElements.found.html('0');
    this.stateElements.total.html(total.toString());
    this.stateElements.root.show();
  }

  updateState(found: number) {
    this.stateElements.found.html(found.toString());
  }

  hideState() {
    this.stateElements.root.hide();
  }
}