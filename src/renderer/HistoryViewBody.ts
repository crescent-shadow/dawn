/**
 * @fileOverview HistoryViewBody
 */

import * as $ from 'jquery';
import './Pagination';
import * as moment from 'moment';
import { db, IHistory } from './History.db';
import { ModeService } from './ModeService';

export class HistoryViewBody {
  public canvas: JQuery<Element> = $('<section>');
  private readonly commonClassName: string = 'view-body';
  private readonly specificClassName: string = 'history-view-body';
  private readonly dataListClassName: string = 'history-view-data';
  private readonly paginationClassName: string = 'history-view-data-pagination';
  private modeService: ModeService;

  constructor() {
    this.canvas
      .addClass(this.commonClassName)
      .addClass(this.specificClassName);
    this.modeService = new ModeService();
  }

  public render(): void {
    this.canvas
      .append(this.generateModeItems())
      .append(this.generateHistoryTable());
    $(`.history-view-body-modes button`).first().trigger('click');
  }

  private generateModeItems(): JQuery<Element> {
    const self = this;
    const container = $(`<div class="history-view-body-modes">`);
    const modes = this.modeService.items.map((mode, index) => {
      let buttonClassName = `history-view-body-modes-${mode.name}`;

      if (index === 0) {
        buttonClassName += ' active';
      }

      return $(`<button>`)
        .addClass(buttonClassName)
        .text(mode.name)
        .click(async function () {
          self.canvas.find(`.${self.paginationClassName}`).remove();
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          const pagination = await self.paginate(mode.name);
          self.canvas.append(pagination);
        });
    });

    return container.append(modes);
  }

  private generateHistoryTable(): JQuery<Element> {
    const table = $(`<table class="${this.dataListClassName}">`);
    const tableHeader = $(`<thead>
      <tr>
        <th>Rank</th>
        <th>Spent</th>
        <th>Played At</th>
      </tr>
    </thead>`);
    const tableBody = $('<tbody>');

    return table
      .append(tableHeader)
      .append(tableBody);
  }

  private generateHistoryTableItems(histories): void {
    const tableBody = this.canvas.find(`.${this.dataListClassName} tbody`);
    let historyElements;

    if (histories.length === 0) {
      historyElements = $(`<tr>
        <td colspan="3">No Data Available</td>
      </tr>`);
    } else {
      historyElements = histories.map((history, index) => {
        return $(`<tr>
        <td class="history-view-data-index">${index + 1}</td>
        <td class="history-view-data-spent">${this.displayTime(history.time)}</td>
        <td class="history-view-data-created">${moment(history.created_at).format('YYYY-MM-DD HH:mm')}</td>
      </tr>`);
      });
    }

    tableBody.html(historyElements);
  }

  private async getHistoryData(modeName: string): Promise<IHistory[]> {
    return await db.histories.orderBy('time').filter(item => {
      return item.mode.name === modeName;
    }).limit(10).toArray();
  }

  private async paginate(modeName: string) {
    const self = this;
    const histories = await this.getHistoryData(modeName);
    const container: any = $('<div>')
      .addClass(this.paginationClassName);

    container.pagination({
      dataSource: histories,
      pageSize: 5,
      callback: function (data) {
        self.generateHistoryTableItems(data);
      }
    });
    return container;
  }

  private displayTime(value): string {
    const m: number = Math.floor((value % 3600) / 60);
    const s: number = Math.max(Math.floor((value % 3600) % 60), 0);

    return m === 0 ? `${s} Secs` : `${m} Mins ${s} Secs`;
  }
}
