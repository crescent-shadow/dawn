/**
 * @fileOverview GridViewHeader Class.
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import anime = require('animejs');

import { GridViewHeaderHomeButton } from './GridViewHeaderHomeButton';
import { GridViewHeaderRestartButton } from './GridViewHeaderRestartButton';
import { GridViewHeaderTimer } from './GridViewHeaderTimer';
import { IMode } from './typings/mode.interface';

interface IStateElements {
  root?: JQuery<Element>;
  found?: JQuery<Element>;
  total?: JQuery<Element>;
}

export class GridViewHeader {
  public canvas: JQuery<Element> = $('<div>');
  private commonClassName: string = 'view-header';
  private specificClassName: string = 'grid-view-header';
  private homeButton: GridViewHeaderHomeButton;
  private restartButton: GridViewHeaderRestartButton;
  private timer: GridViewHeaderTimer;
  private modeName: JQuery<Element>;
  private stateElements: IStateElements = {};
  private mode: IMode;
  private successNode: JQuery<Element> = $('<div>');
  private failNode: JQuery<Element> = $('<div>');

  constructor() {
    this.homeButton = new GridViewHeaderHomeButton();
    this.restartButton = new GridViewHeaderRestartButton();
    this.timer = new GridViewHeaderTimer();
    const leftArea = this.generateLeftArea();
    const rightArea: JQuery<Element> = this.generateRightArea();

    this.generateSuccessNode();
    this.generateFailNode();

    this.canvas
      .addClass(this.commonClassName)
      .addClass(this.specificClassName)
      .append(this.homeButton.canvas)
      .append(this.restartButton.canvas)
      .append(leftArea)
      .append(rightArea)
      .append(this.successNode)
      .append(this.failNode);
  }

  public init(mode: IMode) {
    this.mode = mode;
    this.updateModeName(mode.name);
    this.initState();
    this.timer.tick();
    this.homeButton.show();
    this.restartButton.canvas.data('mode', mode);
    this.restartButton.show();
  }

  public success() {
    this.timer.stop();
    this.successNode
      .find('.grid-view-header-success-timer')
      .html(this.timer.display());
    anime({
      targets: this.successNode.get(),
      height: [0, '100%'],
      duration: 300,
      easing: 'easeOutSine'
    });
  }

  public fail() {
    this.timer.stop();
    this.failNode
      .find('.grid-view-header-fail-timer')
      .html(this.timer.display());
    anime({
      targets: this.failNode.get(),
      height: [0, '100%'],
      duration: 300,
      easing: 'easeOutSine'
    });
  }

  public updateState(found: number): void {
    const isFoundOverload = found > this.mode.mines;
    this.stateElements.found
      .toggleClass('status-state-found-overload', isFoundOverload)
      .html(found.toString());
  }

  private generateSuccessNode(): void {
    const container: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-success-container');
    const label: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-success-label')
      .text('success');
    const timer: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-success-timer');
    container.append(label).append(timer);
    this.successNode
      .addClass('grid-view-header-success')
      .append(container);
  }

  private generateFailNode(): void {
    const container: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-fail-container');
    const label: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-fail-label')
      .text('fail');
    const timer: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-fail-timer');
    container.append(label).append(timer);
    this.failNode
      .addClass('grid-view-header-fail')
      .append(container);
  }

  private generateLeftArea(): JQuery<Element> {
    const leftArea: JQuery = $('<div>').addClass('grid-view-header-left');
    this.modeName = $('<div>').addClass('grid-view-header-mode-name');
    this.generateStatesElements();

    return leftArea
      .append(this.modeName)
      .append(this.stateElements.root);
  }

  private generateStatesElements(): void {
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

  private generateRightArea(): JQuery<Element> {
    const rightArea: JQuery<Element> = $('<div>')
      .addClass('grid-view-header-right');
    rightArea.append(this.timer.canvas);

    return rightArea;
  }

  private updateModeName(modeName: string): void {
    this.modeName.html(modeName);
  }

  private initState(): void {
    this.stateElements.found.html('0');
    this.stateElements.total.html(this.mode.mines.toString());
    this.stateElements.root.show();
  }
}
