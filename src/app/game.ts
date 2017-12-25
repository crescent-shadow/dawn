import * as $ from 'jquery';
import { Events } from './events';
import { Mode } from './typings/mode.interface';
import { Header } from './header';
import { ModeView } from './mode-view';
import { GridView } from './grid-view';
import { Status } from './status';

export class Game {
  canvas: JQuery<Element> = $('body');
  header: Header;
  $main: JQuery<Element>;
  status: Status;
  modeView: ModeView;
  gridView: GridView;

  constructor() {
    this.header = new Header();
    this.modeView = new ModeView();
    this.status = new Status();
    this.gridView = new GridView();

    let $main = $('<main>');
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
    this.status.hideState();
    this.status.toggleRestartButton(false);
    this.status.updateResult();
    this.activate(this.modeView);
  }

  start(event, mode: Mode) {
    this.gridView.init(mode);
    this.status.initState(this.gridView.mines);
    this.status.toggleRestartButton(true);
    this.status.updateResult(0);
    this.activate(this.gridView);
  }

  activate(view: ModeView | GridView) {
    this.modeView.canvas.hide();
    this.modeView.canvas.hide();

    this.$main.width(view.width);
    this.status.updateMode(view.title);

    view.canvas.show();
  }

  defeat() {
    this.gridView.freeze();
    this.status.updateResult(2);
  }

  victory() {
    this.gridView.freeze();
    this.status.updateResult(1);
  }

  update(event, found: number) {
    this.status.updateState(found);
  }
}