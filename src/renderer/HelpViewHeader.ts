/**
 * @fileOverview HelpViewHeader
 */

import * as $ from 'jquery';
import anime = require('animejs');


export class HelpViewHeader {
  public canvas: JQuery<Element>;
  private commonClassName: string = 'view-header';
  private specificClassName: string = 'help-view-header';
  private titleClassName: string = 'help-view-header-title';

  constructor() {
    // 生成画布
    this.canvas = $('<section>')
      .addClass(this.commonClassName)
      .addClass(this.specificClassName);

    // 获取 Title 节点
    const title: JQuery<Element> = this.getTitleNode();

    // 追加 Title 节点到 Header 的画布上
    this.canvas.append(title);
  }

  /**
   * @description 执行动画
   */
  public doMotion(): void {
    this.doTitleMotion();
  }

  /**
   * @description 生成 Title 节点
   * @returns {JQuery<Element>}
   */
  private getTitleNode(): JQuery<Element> {
    return $('<span>')

    // 添加 Title 的 CSS 类名
      .addClass(this.titleClassName)

      // 设置 Title 节点的文本
      .text('Help');
  }

  /**
   * @description Title 文字的动画效果
   */
  private doTitleMotion(): void {
    anime({
      targets: `.${this.titleClassName}`,
      translateX: [-30, 0],
      opacity: [0, 1],
      easing: 'easeOutQuint'
    });
  }

}
