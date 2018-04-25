/**
 * @fileOverview Base View for Success/Fail View
 */

import * as $ from 'jquery';
import { Events } from './Events';
import { IMode } from './typings/mode.interface';

export class ResultBaseView {
  public canvas: JQuery<Element>;
  readonly canvasClassName: string = '';
  readonly buttonContainerClassName: string = '';
  readonly homeButtonClassName: string = '';
  readonly tryAgainButtonClassName: string  = '';
  private mode: IMode;

  constructor(
    canvasClassName: string,
    buttonContainerClassName: string,
    homeButtonClassName: string,
    tryAgainButtonClassName: string
  ) {
    this.canvasClassName = `result-view-container ${canvasClassName}`;
    this.buttonContainerClassName = `result-view-buttons ${buttonContainerClassName}`;
    this.homeButtonClassName = homeButtonClassName;
    this.tryAgainButtonClassName = tryAgainButtonClassName;
  }

  public init(mode: IMode) {
    this.mode = mode;
    this.generateCanvas();
  }

  public destroy() {
    this.canvas.remove();
  }

  private generateCanvas(): void {
    this.canvas = $('<div>').addClass(this.canvasClassName);

    const overlay = this.getOverlay();
    const content = this.getContent();

    this.canvas
      .append(overlay)
      .append(content);
  }

  private getOverlay(): JQuery<Element> {
    const overlay: JQuery<Element> = $('<div>');
    overlay.addClass('result-view-overlay');

    return overlay;
  }

  private getContent(): JQuery<Element> {
    const content: JQuery<Element> = $('<div>')
      .addClass('result-view');
    const buttons = this.getButtons();

    content.append(buttons);

    return content;
  }

  private getButtons(): JQuery<Element> {
    const buttonsContainer: JQuery<Element> = $('<div>')
      .addClass(this.buttonContainerClassName);
    const homeButton = this.getHomeButton();
    const tryAgainButton = this.getTryAgainButton();

    buttonsContainer
      .append(homeButton)
      .append(tryAgainButton);

    return buttonsContainer;
  }

  private getHomeButton(): JQuery<Element> {
    const button: JQuery<Element> = $('<button>')
      .addClass(this.homeButtonClassName)
      .text('Back to Home');
    button.on('click', () => {
      $(document).trigger(Events.GAME_NEW);
    });

    return button;
  }

  private getTryAgainButton(): JQuery<Element> {
    const button: JQuery<Element> = $('<button>')
      .addClass(this.tryAgainButtonClassName)
      .text('Try Again');
    button.on('click', () => {
      $(document).trigger(Events.GAME_RESTART, [this.mode]);
    });

    return button;
  }

}