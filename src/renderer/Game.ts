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
      .on(Events.GAME_SELECT_MODE, () => this.selectMode())
      .on(Events.GAME_START, (event: JQuery.Event, mode: IMode) => {
        this.start(event, mode);
      })
      .on(Events.GAME_VICTORY, () => this.victory())
      .on(Events.GAME_DEFEAT, () => this.defeat());
  }

  private selectMode(): void {
    this.deactivateModeView();
    this.deactivateGridView();
    this.activateModeView();

    this.header.deactivateRestartButton();
  }

  private start(event: JQuery.Event, mode: IMode): void {
    this.deactivateModeView();
    this.deactivateGridView();
    this.activateGridView(mode);

    this.header.activateRestartButton(mode);
  }

  private activateModeView(): void {
    this.modeView = new ModeView();
    this.canvas.append(this.modeView.canvas);
    this.modeView.render();
  }

  private deactivateModeView(): void {
    if (this.modeView) {
      this.modeView.destroy();
    }
  }

  private activateGridView(mode: IMode): void {
    this.gridView = new GridView(mode);
    this.canvas.append(this.gridView.canvas);
    this.gridView.render();
  }

  private deactivateGridView(): void {
    if (this.gridView) {
      this.gridView.destroy();
    }
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
