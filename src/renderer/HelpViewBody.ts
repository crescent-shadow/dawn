/**
 * @fileOverview HelpViewBody
 */

import * as $ from 'jquery';
import * as feather from 'feather-icons';

export class HelpViewBody {
  public canvas: JQuery<Element>;
  private readonly commonClassName: string = 'view-body';
  private readonly specificClassName: string = 'help-view-body';

  constructor() {
    this.canvas = $('<section>');
    this.canvas
      .addClass(this.commonClassName)
      .addClass(this.specificClassName)
      .append(this.generateContent());
  }

  private generateContent(): JQuery<Element> {
    const content = $(`<table>
        <tr>${this.generateHelpMode().join('')}</tr>
        <tr>${this.generateHelpCell().join('')}</tr>
        <tr>${this.generateHelpCellEmpty().join('')}</tr>
        <tr>${this.generateHelpCellFlag().join('')}</tr>
        <tr>${this.generateHelpCellMine().join('')}</tr>
        <tr>${this.generateHelpCellMineFlag().join('')}</tr>
    </table>`);

    return content.addClass('help-view-content');
  }

  private generateHelpMode(): string[] {
    const title = `<td>Modes</td>`;
    const modes = ['easy', 'normal', 'hard', 'insane'].map(item => {
      const classNames = [
        'help-view-content-mode',
        `help-view-content-mode-${item}`
      ].join(' ');
      return `<span class="${classNames}">${item.toUpperCase()}</span>`;
    }).join(' / ');
    const description = `<td class="help-view-description">There are 4 modes available: <br> ${modes}</td>`;
    return [title, description];
  }

  private generateHelpCell(): string[] {
    const span = `<span class="help-view-content-cell"></span>`;
    return [
      `<td>${span}</td>`,
      `<td class="help-view-description">Unreveal Cell</td>`
    ];
  }

  private generateHelpCellEmpty(): string[] {
    const span = `<span class="help-view-content-cell-reveal"></span>`;
    return [
      `<td>${span}</td>`,
      `<td class="help-view-description">Revealed Empty Cell</td>`
    ];
  }

  private generateHelpCellFlag(): string[] {
    const icon: string = feather.icons['flag'].toSvg();
    const span = `<span class="help-view-content-cell-flag">${icon}</span>`;
    return [
      `<td>${span}</td>`,
      `<td class="help-view-description">Flagged Cell</td>`
    ];
  }

  private generateHelpCellMine(): string[] {
    const icon: string = feather.icons['x-circle'].toSvg();
    const span = `<span class="help-view-content-cell-mine">${icon}</span>`;
    return [
      `<td>${span}</td>`,
      `<td class="help-view-description">Mine Cell</td>`
    ];
  }

  private generateHelpCellMineFlag(): string[] {
    const icon: string = feather.icons['check-circle'].toSvg();
    const span = `<span class="help-view-content-cell-mine-flag">${icon}</span>`;
    return [
      `<td>${span}</td>`,
      `<td class="help-view-description">Flagged Mine Cell</td>`
    ];
  }
}
