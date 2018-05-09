/**
 * @fileOverview ModeView 模式选择视图.
 */

import * as $ from 'jquery';
import { ModeViewHeader } from './ModeViewHeader';
import { ModeViewBody } from './ModeViewBody';

export class ModeView {
  public canvas: JQuery<Element>;

  // 视图的 CSS class 名
  private canvasClassName: string = 'mode-view';

  // 视图包含 头部(ModeViewHeader) 和 主体(ModeBody)
  private header = new ModeViewHeader();
  private body = new ModeViewBody();

  constructor() {
    // 构造视图
    this.canvas = $('<div>')

      // 添加 CSS class
      .addClass(this.canvasClassName)

      // 追加 Header
      .append(this.header.canvas)

      // 追加 Body
      .append(this.body.canvas);
  }

  /**
   * @description 视图销毁
   */
  public destroy(): void {
    // 将 ModeView 画布从页面上移除
    this.canvas.remove();
  }

  public render(): void {
    // 显示 ModeView 的画布
    this.canvas.show();

    // 执行 Header 和 Body 的动画效果
    this.header.doMotion();
    this.body.doMotions();
  }
}
