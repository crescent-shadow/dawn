import * as $ from 'jquery';
import { Events } from './events';

export class Menu {
  canvas: JQuery<Element>;
  statusElements;
  classNames = {
    root: 'menu',
    newGame: 'menu-new-game',
    mineStatus: 'menu-mine-status'
  };
  constructor() {
    let canvas = $('<nav />');

    canvas.addClass(this.classNames.root);
    this.canvas = canvas;
    this.render();
  }

  render() {
    this.statusElements = this.generateStatus();
    this.canvas.append(this.newGameButton());
    this.canvas.append(this.statusElements.root);
  }

  newGameButton() {
    let buttonNewGame = $('<button>');
    buttonNewGame
      .html('New Game')
      .addClass(this.classNames.newGame)
      .on('click', () => {
        $(document).trigger(Events.GAME_NEW);
      });
    return buttonNewGame;
  }

  generateStatus() {
    let statusElement = $('<div>');
    let progressElement = $('<span>');
    let totalElement = $('<span>');

    progressElement
      .addClass('status-progress')
      .html('0');
    totalElement
      .addClass('status-total')
      .html('0');
    statusElement
      .addClass(this.classNames.mineStatus)
      .append(progressElement)
      .append(' of ')
      .append(totalElement)
      .hide();

    return {
      root: statusElement,
      progress: progressElement,
      total: totalElement
    };
  }

  initStatus(totalMines: number) {
    this.statusElements.total.html(totalMines);
    this.statusElements.root.show();
  }

  resetStatus() {
    this.statusElements.root.hide();
  }

  updateStatus(progress: number) {
    this.statusElements.progress.html(progress);
  }
}