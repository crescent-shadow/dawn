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
        $(document).trigger(Events.GAME_SELECT_MODE);
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
    });
  });

  describe('Game Methods', () => {
    beforeEach(() => {
      this.game.init();
      this.modeService = new ModeService();
    });

    it('selectMode', () => {
      const gridViewClearSpy = spyOn(this.game.gridView, 'clear');
      const activateSpy = spyOn(this.game, 'activate');

      this.game.selectMode();
      expect(gridViewClearSpy).toHaveBeenCalled();
      expect(activateSpy).toHaveBeenCalledWith(this.game.modeView);
    });

    it('start', () => {
      const gridViewInitSpy = spyOn(this.game.gridView, 'init');
      const activateSpy = spyOn(this.game, 'activate');
      const mode = this.modeService.items[0];

      this.game.start({}, mode);
      expect(gridViewInitSpy).toHaveBeenCalledWith(mode);
      expect(activateSpy).toHaveBeenCalledWith(this.game.gridView);
    });

    it('activate', () => {
      const view = this.game.modeView;
      this.game.activate(view);

      expect(this.game.$main.width()).toEqual(view.width);
      expect(this.game.gridView.canvas.is(':visible')).toBeFalsy();
      expect(view.canvas.is(':visible')).toBeTruthy();
    });

    it('defeat', () => {
      const gridViewFreezeSpy = spyOn(this.game.gridView, 'freeze');

      this.game.defeat();
      expect(gridViewFreezeSpy).toHaveBeenCalled();
    });

    it('victory', () => {
      const gridViewFreezeSpy = spyOn(this.game.gridView, 'freeze');

      this.game.victory();
      expect(gridViewFreezeSpy).toHaveBeenCalled();
    });
  });
});
