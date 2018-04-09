/**
 * @fileOverview Game.
 */

import * as $ from 'jquery';
import { Events } from './Events';
import { GridView } from './GridView';
import { Header } from './Header';
import { ModeView } from './ModeView';
import { ResultsEnum } from './results.enum';
import { Status } from './status';
import { IMode } from './typings/mode.interface';

export class Game {
  public canvas: JQuery<Element> = $('body');
  public header: Header;
  public $main: JQuery<Element>;
  public status: Status;
  public modeView: ModeView;
  public gridView: GridView;

  constructor() {
    this.header = new Header();
    this.modeView = new ModeView();
    this.status = new Status();
    this.gridView = new GridView();
  }

  public init(): void {
    const $main: JQuery = $('<main>');
    $main
      .append(this.status.canvas)
      .append(this.modeView.canvas)
      .append(this.gridView.canvas);

    this.events();
    this.canvas
      .addClass('background')
      .append(this.header.canvas)
      .append($main);
    this.$main = $main;
    this.activate(this.modeView);
  }

  private events(): void {
    $(window).on('contextmenu', false);

    $(document)
      .on(Events.GAME_NEW, this.selectMode.bind(this))
      .on(Events.GAME_START, this.start.bind(this))
      .on(Events.GAME_VICTORY, this.victory.bind(this))
      .on(Events.GAME_DEFEAT, this.defeat.bind(this))
      .on(Events.GAME_UPDATE, this.update.bind(this));
  }

  private selectMode(): void {
    this.gridView.clear();
    this.status.reset();
    this.activate(this.modeView);
  }

  private start(mode: IMode): void {
    this.gridView.init(mode);
    this.status.init(this.gridView.mines);
    this.activate(this.gridView);
  }

  private activate(view: ModeView | GridView): void {
    this.modeView.canvas.hide();
    this.modeView.canvas.hide();

    this.$main.width(view.width);
    this.status.updateMode(view.title);

    view.canvas.show();
  }

  private defeat(): void {
    this.gridView.freeze();
    this.status.timer.stop();
    this.status.updateResult(ResultsEnum.Defeat);
  }

  private victory(): void {
    this.gridView.freeze();
    this.status.timer.stop();
    this.status.updateResult(ResultsEnum.Victory);
  }

  private update(found: number): void {
    this.status.updateState(found);
  }
}
