/**
 * @fileOverview Header Component.
 */

import * as $ from 'jquery';
import { HomeButton } from './HomeButton';
import { RestartButton } from './RestartButton';
import { IMode } from './typings/mode.interface';

export class Header {
  public canvas: JQuery<Element>;
  private canvasClassName: string = 'header';
  private headerContainerClassName: string = 'header-container';
  private homeButton: HomeButton;
  private restartButton: RestartButton;

  constructor() {
    const canvas: JQuery<Element> = $('<header>');

    const buttons = this.generateButtonsContainer();
    const headerContainer = $('<div>')
      .addClass(this.headerContainerClassName)
      .append(buttons);
    canvas
      .addClass(this.canvasClassName)
      .append(headerContainer);
    this.canvas = canvas;
  }

  public activateRestartButton(mode: IMode): void {
    this.restartButton.activate(mode);
  }

  public deactivateRestartButton(): void {
    this.restartButton.deactivate();
  }

  private generateButtonsContainer(): JQuery<Element> {
    const container: JQuery<Element> = $('<div>');

    this.homeButton = new HomeButton();
    this.restartButton = new RestartButton();
    container
      .append(this.homeButton.canvas)
      .append(this.restartButton.canvas);

    return container;
  }
}
