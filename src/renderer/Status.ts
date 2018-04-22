/**
 * @fileOverview Status Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { ResultsEnum } from './results.enum';
import { Restarter } from './status/Restarter';
import { Timer } from './status/Timer';
import { HomeButton } from './status/HomeButton';

interface IStateElements {
  root?: JQuery<Element>;
  found?: JQuery<Element>;
  total?: JQuery<Element>;
}

export class Status {
  public canvas: JQuery<Element> = $('<div>');
  public $mode: JQuery<Element>;
  public homeButton: HomeButton;
  public $result: JQuery<Element>;
  public restarter: Restarter;
  public timer: Timer;
  public stateElements: IStateElements = {};

  private minesTotal: number = 0;

  constructor() {
    const $modeInfo: JQuery = this.generateModeInfoElement();
    const $resultInfo: JQuery = this.generateResultInfoElement();

    this.restarter = new Restarter();
    this.homeButton = new HomeButton();

    this.canvas
      .addClass('status')
      .append(this.homeButton.canvas)
      .append(this.restarter.canvas)
      .append($modeInfo)
      .append($resultInfo);
  }

  public reset(): void {
    this.minesTotal = 0;
    this.stateElements.found.removeClass('status-state-found-overload');
    this.hideState();
    this.homeButton.hide();
    this.restarter.hide();
    this.updateResult();
    this.timer.reset();
  }

  public init(mode, mines: number): void {
    this.initState(mines);
    this.homeButton.show();
    this.restarter.canvas.data('mode', mode);
    this.restarter.show();
    this.updateResult(ResultsEnum.InProgress);
    this.timer.tick();
  }

  // Mode Info
  public generateModeInfoElement(): JQuery {
    const $modeInfo: JQuery = $('<div>').addClass('status-mode-info');
    this.generateModeElement();
    this.generateStatesElements();

    return $modeInfo
      .append(this.$mode)
      .append(this.stateElements.root);
  }

  public generateModeElement(): void {
    this.$mode = $('<div>').addClass('status-mode');
  }

  public updateMode(modeLabel: string): void {
    this.$mode.html(modeLabel);
  }

  public generateStatesElements(): void {
    const stateClass: string = 'status-state';
    const $stateRoot: JQuery = $('<div>').addClass(stateClass);
    const $stateFound: JQuery = $('<span>').addClass(`${stateClass}-found`);
    const $stateTotal: JQuery = $('<span>').addClass(`${stateClass}-total`);

    this.stateElements.root = $stateRoot;
    this.stateElements.found = $stateFound;
    this.stateElements.total = $stateTotal;

    $stateRoot
      .hide()
      .append($stateFound)
      .append(' OF ')
      .append($stateTotal)
      .append(' MINES Found');
  }

  public initState(total: number): void {
    this.minesTotal = total;

    this.stateElements.found.html('0');
    this.stateElements.total.html(total.toString());
    this.stateElements.root.show();
  }

  public updateState(found: number): void {
    const isFoundOverload = found > this.minesTotal;
    this.stateElements.found.toggleClass('status-state-found-overload', isFoundOverload);
    this.stateElements.found.html(found.toString());
  }

  public hideState(): void {
    this.stateElements.root.hide();
  }

  // Result Info
  public generateResultInfoElement(): JQuery {
    const $resultInfo: JQuery = $('<div>').addClass('status-result-info');
    this.generateResultElement();
    this.generateTimerElement();

    return $resultInfo
      .append(this.$result)
      .append(this.timer.canvas);
  }

  public generateResultElement(): void {
    this.$result = $('<div>')
      .addClass('status-result');
  }

  public updateResult(result?: number): void {
    const iconInProgress: string = feather.icons['more-horizontal'].toSvg();
    const iconVictory: string = feather.icons['check-square'].toSvg();
    const iconDefeat: string = feather.icons['x-square'].toSvg();

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
      default:
    }
  }

  public generateTimerElement(): void {
    this.timer = new Timer();
  }
}
