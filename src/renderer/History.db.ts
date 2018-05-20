import Dexie from 'dexie';
import { IMode } from './typings/mode.interface';

export interface IHistory {
  id?: number;
  mode: IMode;
  time: number;
  created_at: Date;
}

export class HistoryDb extends Dexie {
  private dbVersion: number = 1;
  public histories: Dexie.Table<IHistory, number>;

  constructor() {
    super('HistoryDb');
    this.version(this.dbVersion).stores({
      histories: '++id, mode, time, created_at'
    });
  }
}

export const db = new HistoryDb();
