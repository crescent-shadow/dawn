import * as $ from 'jquery';
import { Events } from './events';
import { Mode } from './typings/mode.interface';
import { Menu } from './menu';
import { ModeView } from './mode-view';
import { GridView } from './grid-view';

export class Game {
  canvas: JQuery<Element> = $('body');
  menu: Menu;
  modeView: ModeView;
  gridView: GridView;

  constructor() {
    this.menu = new Menu();
    this.modeView = new ModeView();
    this.gridView = new GridView();

    this.events();
    this.canvas
      .append(this.menu.canvas)
      .append(this.modeView.canvas)
      .append(this.gridView.canvas);
  }

  events() {
    $(window).on('contextmenu', false);

    $(document)
      .on(Events.GAME_NEW, this.selectMode.bind(this))
      .on(Events.GAME_START, this.start.bind(this))
      .on(Events.GAME_VICTORY, this.victory.bind(this))
      .on(Events.GAME_DEFEAT, this.defeat.bind(this))
      .on(Events.GAME_UPDATE, this.update.bind(this));
  }

  selectMode() {
    this.gridView.clear();
    this.menu.resetStatus();
    this.activate(this.modeView);
  }

  start(event, mode: Mode) {
    this.gridView.init(mode);
    this.menu.initStatus(this.gridView.mines);
    this.activate(this.gridView);
  }

  activate(view: ModeView | GridView) {
    this.modeView.canvas.hide();
    this.modeView.canvas.hide();

    view.canvas.show();
  }

  defeat() {
    this.gridView.freeze();
    window.alert('Defeat');
  }

  victory() {
    this.gridView.freeze();
    window.alert('Victory');
  }

  update(event, progress: number) {
    this.menu.updateStatus(progress);
  }
}