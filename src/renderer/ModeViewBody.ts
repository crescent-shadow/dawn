/**
 * @fileOverview ModeViewBody Mode 视图的主体
 */

import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { Howl } from 'howler';
import anime = require('animejs');
import { IMode } from './typings/mode.interface';
import { Events } from './Events';
import { ModeService } from './ModeService';

// 指定音效文件的路径
const sfxForModeSelectPath: string = require('./assets/audios/btn_mode_select.mp3');
const sfxForModeHoverPath: string = require('./assets/audios/btn_mode_hover.mp3');

export class ModeViewBody {
  public canvas: JQuery<Element> = $('<section>');

  // 主体节点的 CSS 类名
  readonly commonClassName: string = 'view-body';
  readonly specificClassName: string = 'mode-view-body';
  readonly modeSelectorsContainerClassName: string = 'mode-view-selectors';
  readonly modeSelectorClassName: string = 'mode-view-selector';
  readonly modeDataKey = 'mode';

  // ModeService 用于获取所有的模式设定数据
  private modeService: ModeService;

  // 实例化 音效控制类 Howl
  private sfxForModeSelect = new Howl({ src: [sfxForModeSelectPath] });
  private sfxForModeHover = new Howl({ src: [sfxForModeHoverPath], volume: 0.3 });

  constructor() {

    // 实例化 ModeService
    this.modeService = new ModeService();

    // 获取模式按钮
    const selectorsElement: JQuery<Element> = this.getSelectors();

    // 构造画布
    this.canvas

      // 添加 CSS 类名
      .addClass(this.commonClassName)
      .addClass(this.specificClassName)

      // 追加 模式按钮 到画布上
      .append(selectorsElement)

      // 注册 点击模式按钮 时的回调函数
      .on('click', `.${this.modeSelectorClassName} button`, (event: JQuery.Event) => {

        // 播放点击的音效
        this.sfxForModeSelect.play();

        // 选择模式
        this.selectMode(event);
      });
  }

  /**
   * @description 执行动画
   */
  public doMotions() {

    // 执行 模式选择按钮 的动画效果
    this.doSelectorsMotion();
  }

  /**
   * @description 生成 多个模式按钮节点
   * @returns {JQuery<Element>}
   */
  private getSelectors(): JQuery<Element> {

    // 构造模式的 包含节点
    const container: JQuery = $('<div>')
      .addClass(this.modeSelectorsContainerClassName);

    // 构造 模式按钮节点
    const selectors: JQuery<Element>[] = this.modeService.items
      .map((mode: IMode) => this.getSelector(mode));

    // 追加 模式按钮节点 到 包含节点 上
    container.append(selectors);

    // 返回 包含节点
    return container;
  }

  /**
   * @description 构造 单个模式按钮节点
   * @param {IMode} mode
   * @returns {JQuery<Element>}
   */
  private getSelector(mode: IMode): JQuery<Element> {
    const div: JQuery<Element> = $('<div>');
    const button: JQuery = $('<button />');
    const icon: string = feather.icons[mode.icon].toSvg();
    const label: JQuery = $(`<span>${mode.name.toUpperCase()}</span>`);

    // 模式按钮
    button
      // 将模式的设定数据绑定到节点的 data 属性上
      .data(this.modeDataKey, mode)

      // 追加 图标
      .append(icon)

      // 追加 文本
      .append(label)

      // 注册 按钮鼠标滑过事件 的回调函数
      .on('mouseenter', () => {

        // 播放音效
        this.sfxForModeHover.play();
      });

    // 模式按钮的包含节点
    div
      .addClass(this.modeSelectorClassName)
      .addClass(`${this.modeSelectorClassName}-${mode.name}`)
      .append(button);

    return div;
  }

  /**
   * @description 选择模式。点击按钮时触发
   * @param {JQuery.Event} event
   */
  private selectMode(event: JQuery.Event) {
    const element: JQuery = $(event.currentTarget);

    // 触发 GAME_START 事件
    $(document).trigger(Events.GAME_START, [
      element.data(this.modeDataKey)
    ]);
  }

  /**
   * @description 执行多个模式选择按钮的动画效果
   */
  private doSelectorsMotion() {
    anime({
      targets: `.${this.modeSelectorClassName}`,
      translateY: [-30, 0],
      opacity: [0, 1],
      delay: (el, index) => index * 50,
      easing: 'easeOutQuint'
    })
  }
}
