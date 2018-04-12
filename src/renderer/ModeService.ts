import { IMode } from './typings/mode.interface';

/**
 * @fileOverview Mode Service
 */

export class ModeService {
  private _items: IMode[];

  constructor() {
    this._items = [
      { name: 'easy', rows: 8, cols: 8, mines: 10, icon: 'cloud' },
      { name: 'normal', rows: 16, cols: 16, mines: 40, icon: 'cloud-rain' },
      { name: 'hard', rows: 16, cols: 30, mines: 99, icon: 'cloud-snow' },
      { name: 'insane', rows: 24, cols: 30, mines: 200, icon: 'cloud-lightning' }
    ];
  }

  get items(): IMode[] {
    return this._items;
  }
}
