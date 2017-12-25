import * as $ from 'jquery';
import { Events } from './events';

const ICON_RESULT_IN_PROGRESS = require('../assets/feather/circle.svg');
const ICON_RESULT_VICTORY = require('../assets/feather/check-circle.svg');
const ICON_RESULT_DEFEAT = require('../assets/feather/x-circle.svg');
const ICON_RESTART = require('../assets/feather/rotate-cw.svg');

interface StateElements {
  root?: JQuery<Element>;
  found?: JQuery<Element>;
  total?: JQuery<Element>;
}

export class Status {
  canvas: JQuery<Element> = $('<div>');
  $mode: JQuery<Element>;
  $result: JQuery<Element>;
  $restartButton: JQuery<Element>;
  stateElements: StateElements = {};

  constructor() {
    this.generateModeElement();
    this.generateRestartButton();
    this.generateResultElement();
    this.generateStatesElements();
    this.canvas
      .addClass('status')
      .append(this.$restartButton)
      .append(this.$mode)
      .append(this.$result)
      .append(this.stateElements.root);
  }

  generateModeElement() {
    this.$mode = $('<div>').addClass('status-mode');
  }

  generateRestartButton() {
    this.$restartButton = $('<button>');
    let label = $(`<span>Restart</span>`);

    this.$restartButton
      .append(ICON_RESTART)
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
    this.$result
      .empty()
      .removeClass('status-result-in-progress')
      .removeClass('status-result-victory')
      .removeClass('status-result-defeat');

    switch (result) {
      case 0:
        this.$result
          .addClass('status-result-in-progress')
          .append(ICON_RESULT_IN_PROGRESS);
        break;
      case 1:
        this.$result
          .addClass('status-result-victory')
          .append(ICON_RESULT_VICTORY)
          .append(' Victory');
        break;
      case 2:
        this.$result
          .addClass('status-result-defeat')
          .append(ICON_RESULT_DEFEAT)
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