import * as feather from 'feather-icons';
import { customMatchers } from '../support/matchers';
import { Cell } from '../../src/renderer/Cell';

describe('Cell', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    this.cell = new Cell(1, 1);
  });

  afterEach(() => {
    this.cell = null;
  });

  describe('Properties', () => {
    it('#row', () => {
      expect(this.cell.row).toEqual(1);
    });

    it('#col', () => {
      expect(this.cell.col).toEqual(1);
    });

    it('#value', () => {
      expect(this.cell.value).toEqual(0);
    });

    it('#isMine', () => {
      expect(this.cell.isMine).toBeFalsy();
    });

    it('#isRevealed', () => {
      expect(this.cell.isRevealed).toBeFalsy();
    });

    it('#isFlagged', () => {
      expect(this.cell.isFlagged).toBeFalsy();
    });

    it('#element', () => {
      expect(this.cell.element).toBeJQuery();
      expect(this.cell.element.attr('class')).toContain('cell');
      expect(this.cell.element.data('cell')).toEqual(this.cell);
    });
  });

  describe('#isEmpty()', () => {
    it('true when value is 0', () => {
      this.cell.value = 0;
      expect(this.cell.isEmpty()).toBeTruthy();
    });
    it('false when value > 0', () => {
      this.cell.value = 1;
      expect(this.cell.isEmpty()).toBeFalsy();
    });
  });

  describe('#reveal()', () => {
    it('should be revealed', () => {
      this.cell.reveal();
      expect(this.cell.isRevealed).toBeTruthy();
    });

    describe('should show correct value', () => {
      it('should show empty html', () => {
        this.cell.value = 0;
        this.cell.reveal();
        expect(this.cell.element.html()).toEqual('');
      });

      it('should show value', () => {
        this.cell.value = 1;
        this.cell.reveal();
        expect(this.cell.element.html()).toEqual('1');
      });
    });

    it('should have .reveal class', () => {
      this.cell.reveal();
      expect(this.cell.element.attr('class')).toContain('reveal');
    });
  });

  describe('#flag()', () => {
    describe('flag with true', () => {
      beforeEach(() => this.cell.flag(true));

      it('isFlagged should be true', () => {
        expect(this.cell.isFlagged).toBeTruthy();
      });

      it('element should have correct class', () => {
        expect(this.cell.element.attr('class')).toContain('flag');
      });

      it('element should show flag icon', () => {
        const icon = feather.icons.flag.toSvg();
        expect(this.cell.element.html()).toContain(icon);
      });
    });

    describe('flag with false', () => {
      beforeEach(() => this.cell.flag(false));
      it('isFlagged should be false', () => {
        expect(this.cell.isFlagged).toBeFalsy();
      });

      it('element should have correct class', () => {
        expect(this.cell.element.attr('class')).not.toContain('flag');
      });

      it('element should not show flag icon', () => {
        expect(this.cell.element.html()).toBe('');
      });
    });
  });

  describe('#mine()', () => {
    it('element class', () => {
      this.cell.mine();
      expect(this.cell.element.attr('class')).toContain('mine');
    });

    it('mine when isFlagged is true', () => {
      const icon = feather.icons['check-circle'].toSvg();
      this.cell.isFlagged = true;
      this.cell.mine();
      expect(this.cell.element.html()).toContain(icon);
    });

    it('mine when isFlagged is false', () => {
      const icon = feather.icons['x-circle'].toSvg();
      this.cell.isFlagged = false;
      this.cell.mine();
      expect(this.cell.element.html()).toContain(icon);
    });
  });
});