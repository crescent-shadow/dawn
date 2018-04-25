/**
 * @fileOverview Game.
 */

import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';
import { GridView } from './GridView';
import { Header } from './Header';
import { ModeView } from './ModeView';
import { ResultsEnum } from './results.enum';
import { Status } from './Status';
import { IMode } from './typings/mode.interface';
import { SuccessView } from './SuccessView';
import { FailView } from './FailView';

export class Game {
  public canvas: JQuery<Element> = $('body');
  public header: Header;
  public $main: JQuery<Element>;
  public status: Status;
  public modeView: ModeView;
  public gridView: GridView;
  private successView: SuccessView;
  private failView: FailView;

  private sfxBgPath: string = require('./assets/audios/bg1.mp3');
  private sfxBg: Howl = new Howl({
    src: [this.sfxBgPath],
    loop: true,
    volume: 0.4
  });
  private sfxVictoryPath: string = require('./assets/audios/victory.mp3');
  private sfxVictory: Howl = new Howl({ src: [this.sfxVictoryPath]});
  private sfxDefeatPath: string = require('./assets/audios/victory.mp3');
  private sfxDefeat: Howl = new Howl({ src: [this.sfxDefeatPath]});

  constructor() {
    this.header = new Header();
    this.modeView = new ModeView();
    this.status = new Status();
    this.gridView = new GridView();
    this.successView = new SuccessView();
    this.failView = new FailView();
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
      .on(Events.GAME_NEW, () => this.selectMode())
      .on(Events.GAME_START, (event: JQuery.Event, mode: IMode) => {
        this.start(event, mode);
      })
      .on(Events.GAME_RESTART, (event: JQuery.Event, mode: IMode) => {
        this.restart(event, mode);
      })
      .on(Events.GAME_VICTORY, () => this.victory())
      .on(Events.GAME_DEFEAT, () => this.defeat())
      .on(Events.GAME_UPDATE, (event: JQuery.Event, found: number) => {
        this.update(event, found);
      });
  }

  private selectMode(): void {
    this.gridView.clear();
    this.status.reset();
    this.successView.destroy();
    this.failView.destroy();
    this.activate(this.modeView);
  }

  private start(event: JQuery.Event, mode: IMode): void {
    this.gridView.init(mode);
    this.status.init(mode, this.gridView.mines);
    this.successView.init(mode);
    this.failView.init(mode);
    this.activate(this.gridView);
  }

  private restart(event: JQuery.Event, mode: IMode): void {
    this.successView.destroy();
    this.failView.destroy();
    this.gridView.clear();
    this.status.reset();
    this.gridView.init(mode);
    this.status.init(mode, this.gridView.mines);
    this.successView.init(mode);
    this.failView.init(mode);
    this.activate(this.gridView);
  }

  private activate(view: ModeView | GridView): void {
    this.modeView.canvas.hide();
    this.gridView.canvas.hide();

    this.$main.width(view.width);
    this.status.updateMode(view.title);

    view.canvas.show();
  }

  private defeat(): void {
    this.sfxDefeat.play();
    this.gridView.freeze();
    this.status.timer.stop();
    this.status.updateResult(ResultsEnum.Defeat);
    this.canvas.append(this.failView.canvas);
    this.failView.show();
  }

  private victory(): void {
    this.sfxVictory.play();
    this.gridView.freeze();
    this.status.timer.stop();
    this.status.updateResult(ResultsEnum.Victory);
  }

  private update(event: JQuery.Event, found: number): void {
    this.status.updateState(found);
  }
}
