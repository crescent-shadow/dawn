/**
 * @fileOverview Game.
 */

import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';
import { GridView } from './GridView';
import { Header } from './Header';
import { ModeView } from './ModeView';
import { IMode } from './typings/mode.interface';

export class Game {
  public canvas: JQuery<Element> = $('body');
  public header: Header;
  public $main: JQuery<Element>;
  public modeView: ModeView;
  public gridView: GridView;

  private sfxBgPath: string = require('./assets/audios/bg1.mp3');
  private sfxBg: Howl = new Howl({
    src: [this.sfxBgPath],
    loop: true,
    volume: 0.4
  });
  private sfxVictoryPath: string = require('./assets/audios/victory.mp3');
  private sfxVictory: Howl = new Howl({ src: [this.sfxVictoryPath]});
  private sfxDefeatPath: string = require('./assets/audios/defeat.mp3');
  private sfxDefeat: Howl = new Howl({ src: [this.sfxDefeatPath]});

  constructor() {
    this.header = new Header();
  }

  public init(): void {
    this.events();
    this.canvas
      .addClass('background')
      .append(this.header.canvas);

    this.selectMode();
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
      .on(Events.GAME_DEFEAT, () => this.defeat());
  }

  private selectMode(): void {
    this.deactivateGridView();
    this.activateModeView();
  }

  private start(event: JQuery.Event, mode: IMode): void {
    this.deactivateModeView();
    this.activateGridView(mode);
  }

  private restart(event: JQuery.Event, mode: IMode): void {
    this.deactivateGridView();
    this.activateGridView(mode);
  }

  private activateModeView(): void {
    this.modeView = new ModeView();
    this.canvas.append(this.modeView.canvas);
    this.switchView(this.modeView);
  }

  private deactivateModeView(): void {
    if (this.modeView) {
      this.modeView.destroy();
    }
  }

  private activateGridView(mode: IMode): void {
    this.gridView = new GridView(mode);
    this.canvas.append(this.gridView.canvas);
    this.switchView(this.gridView);
  }

  private deactivateGridView(): void {
    if (this.gridView) {
      this.gridView.destroy();
    }
  }

  private switchView(view: ModeView | GridView): void {
    view.render();
  }

  private defeat(): void {
    this.sfxDefeat.play();
    this.gridView.freeze(false);
  }

  private victory(): void {
    this.sfxVictory.play();
    this.gridView.freeze(true);
  }
}
