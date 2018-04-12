import * as $ from 'jquery';
import { customMatchers } from '../support/matchers';
import '../support/matchers-typings';
import { Game } from '../../src/renderer/Game';
import { Events } from '../../src/renderer/Events';
import { ModeService } from '../../src/renderer/ModeService';
import { ResultsEnum } from '../../src/renderer/results.enum';

describe('Game', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    this.game = new Game();
  });

  afterEach(() => {
    this.game = null;
    $('body').empty();
  });

  describe('Game Canvas', () => {
    it('should exist', () => {
      expect(this.game.canvas).toBeDefined();
    });

    it('should be a jQuery Element', () => {
      expect(this.game.canvas).toBeJQuery();
    });

    it('should use body node', () => {
      expect(this.game.canvas[0].nodeName).toEqual('BODY');
    });
  });

  describe('Game Init', () => {
    beforeEach(() => {
      this.game.init();
    });

    describe('Elements', () => {
      it('should have the .background class', () => {
        expect(this.game.canvas.attr('class')).toContain('background');
      });
      it('should have a main node', () => {
        expect($('main').length).toEqual(1);
      });

      it('should have a .status node', () => {
        expect($('main .status').length).toEqual(1);
      });

      it('should have a .mode-view node', () => {
        expect($('main .mode-view').length).toEqual(1);
      });

      it('should have a .grid-view node', () => {
        expect($('main .grid-view').length).toEqual(1);
      });
    });

    describe('Events', () => {
      beforeAll(() => {
        this.modeService = new ModeService();
      });

      it('new game', () => {
        const spy = spyOn(this.game, 'selectMode');
        $(document).trigger(Events.GAME_NEW);
        expect(spy).toHaveBeenCalled();
      });

      it('start game', () => {
        const spy = spyOn(this.game, 'start');
        $(document).trigger(Events.GAME_START, [
          this.modeService.items[0]
        ]);
        expect(spy).toHaveBeenCalled();
      });

      it('win game', () => {
        const spy = spyOn(this.game, 'victory');
        $(document).trigger(Events.GAME_VICTORY);
        expect(spy).toHaveBeenCalled();
      });

      it('lose game', () => {
        const spy = spyOn(this.game, 'defeat');
        $(document).trigger(Events.GAME_DEFEAT);
        expect(spy).toHaveBeenCalled();
      });

      it('update game', () => {
        const spy = spyOn(this.game, 'update');
        $(document).trigger(Events.GAME_UPDATE, [1]);
        expect(spy).toHaveBeenCalled();
      });

    });
  });

  describe('Game Methods', () => {
    beforeEach(() => {
      this.game.init();
      this.modeService = new ModeService();
    });

    it('selectMode', () => {
      const gridViewClearSpy = spyOn(this.game.gridView, 'clear');
      const statusResetSpy = spyOn(this.game.status, 'reset');
      const activateSpy = spyOn(this.game, 'activate');

      this.game.selectMode();
      expect(gridViewClearSpy).toHaveBeenCalled();
      expect(statusResetSpy).toHaveBeenCalled();
      expect(activateSpy).toHaveBeenCalledWith(this.game.modeView);
    });

    it('start', () => {
      const gridViewInitSpy = spyOn(this.game.gridView, 'init');
      const statusInitSpy = spyOn(this.game.status, 'init');
      const activateSpy = spyOn(this.game, 'activate');
      const mode = this.modeService.items[0];

      this.game.start({}, mode);
      expect(gridViewInitSpy).toHaveBeenCalledWith(mode);
      expect(statusInitSpy).toHaveBeenCalledWith(this.game.gridView.mines);
      expect(activateSpy).toHaveBeenCalledWith(this.game.gridView);
    });

    it('activate', () => {
      const view = this.game.modeView;
      this.game.activate(view);

      expect(this.game.$main.width()).toEqual(view.width);
      expect(this.game.status.$mode.html()).toEqual(view.title);
      expect(this.game.gridView.canvas.is(':visible')).toBeFalsy();
      expect(view.canvas.is(':visible')).toBeTruthy();
    });

    it('defeat', () => {
      const gridViewFreezeSpy = spyOn(this.game.gridView, 'freeze');
      const statusTimerStopSpy = spyOn(this.game.status.timer, 'stop');
      const statusUpdateResultSpy = spyOn(this.game.status, 'updateResult');

      this.game.defeat();
      expect(gridViewFreezeSpy).toHaveBeenCalled();
      expect(statusTimerStopSpy).toHaveBeenCalled();
      expect(statusUpdateResultSpy).toHaveBeenCalledWith(ResultsEnum.Defeat);
    });

    it('victory', () => {
      const gridViewFreezeSpy = spyOn(this.game.gridView, 'freeze');
      const statusTimerStopSpy = spyOn(this.game.status.timer, 'stop');
      const statusUpdateResultSpy = spyOn(this.game.status, 'updateResult');

      this.game.victory();
      expect(gridViewFreezeSpy).toHaveBeenCalled();
      expect(statusTimerStopSpy).toHaveBeenCalled();
      expect(statusUpdateResultSpy).toHaveBeenCalledWith(ResultsEnum.Victory);
    });

    it('update', () => {
      const statusUpdateStateSpy =  spyOn(this.game.status, 'updateState');

      this.game.update({}, 1);
      expect(statusUpdateStateSpy).toHaveBeenCalledWith(1);
    });
  });
});