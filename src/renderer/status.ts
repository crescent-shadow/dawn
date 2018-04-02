import * as $ from 'jquery';
import * as feather from 'feather-icons';
import { ResultsEnum } from './results.enum';
import { Restarter } from './status/restarter';
import { Timer } from './status/timer';


interface StateElements {
  root?: JQuery<Element>;
  found?: JQuery<Element>;
  total?: JQuery<Element>;
}

export class Status {
  canvas: JQuery<Element> = $('<div>');
  $mode: JQuery<Element>;
  $result: JQuery<Element>;
  restarter: Restarter;
  timer: Timer;
  stateElements: StateElements = {};

  constructor() {
    let $modeInfo = this.generateModeInfoElement();
    let $resultInfo = this.generateResultInfoElement();

    this.restarter = new Restarter();

    this.canvas
      .addClass('status')
      .append(this.restarter.canvas)
      .append($modeInfo)
      .append($resultInfo);
  }

  reset() {
    this.hideState();
    this.restarter.hide();
    this.updateResult();
    this.timer.reset();
  }

  init(mines) {
    this.initState(mines);
    this.restarter.show();
    this.updateResult(ResultsEnum.InProgress);
    this.timer.tick();
  }

  // Mode Info
  generateModeInfoElement() {
    let $modeInfo = $('<div>').addClass('status-mode-info');
    this.generateModeElement();
    this.generateStatesElements();
    return $modeInfo
      .append(this.$mode)
      .append(this.stateElements.root);
  }

  generateModeElement() {
    this.$mode = $('<div>').addClass('status-mode');
  }

  updateMode(modeLabel: string) {
    this.$mode.html(modeLabel);
  }

  generateStatesElements() {
    const stateClass = 'status-state';
    let $stateRoot = $('<div>').addClass(stateClass);
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


  // Result Info
  generateResultInfoElement() {
    const $resultInfo = $('<div>').addClass('status-result-info');
    this.generateResultElement();
    this.generateTimerElement();
    return $resultInfo
      .append(this.$result)
      .append(this.timer.canvas);
  }

  generateResultElement() {
    this.$result = $('<div>')
      .addClass('status-result');
  }

  updateResult(result?: number) {
    const iconInProgress = feather.icons['more-horizontal'].toSvg();
    const iconVictory = feather.icons['check-square'].toSvg();
    const iconDefeat = feather.icons['x-square'].toSvg();

    this.$result
      .empty()
      .removeClass('status-result-in-progress')
      .removeClass('status-result-victory')
      .removeClass('status-result-defeat');

    switch (result) {
      case ResultsEnum.InProgress:
        this.$result
          .addClass('status-result-in-progress')
          .append(iconInProgress)
          .append(' PROGRESS');
        break;
      case ResultsEnum.Victory:
        this.$result
          .addClass('status-result-victory')
          .append(iconVictory)
          .append(' VICTORY');
        break;
      case ResultsEnum.Defeat:
        this.$result
          .addClass('status-result-defeat')
          .append(iconDefeat)
          .append(' DEFEAT');
        break;
    }
  }

  generateTimerElement() {
    this.timer = new Timer();
  }
}