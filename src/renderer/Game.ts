/**
 * @fileOverview Game 类用于控制游戏的所有事件，同时负责激活或者效果相关视图
 */

import * as $ from 'jquery';
import { Howl } from 'howler';
import { Events } from './Events';
import { GridView } from './GridView';
import { Header } from './Header';
import { ModeView } from './ModeView';
import { IMode } from './typings/mode.interface';
import { Boss } from './Boss';

export class Game {
  // 每个类都具有的公开属性 canvas
  public canvas: JQuery<Element> = $('body');
  private boss: Boss;
  private header: Header;
  private modeView: ModeView;
  private gridView: GridView;

  // 声效资源引用和实例化
  private sfxVictoryPath: string = require('./assets/audios/victory.mp3');
  private sfxVictory: Howl = new Howl({ src: [this.sfxVictoryPath]});
  private sfxDefeatPath: string = require('./assets/audios/defeat.mp3');
  private sfxDefeat: Howl = new Howl({ src: [this.sfxDefeatPath]});

  constructor() {
    this.header = new Header();
  }

  /**
   * @description Game 的初始化
   */
  public init(): void {
    // 注册游戏事件
    this.events();

    // 设定画布的属性和内容，这里添加了 Header 和 background CSS 类
    this.canvas
      .addClass('background')
      .append(this.header.canvas);

    // 初始化 Boss，并将 boss 实例绑定到 window 上，可以直接在 console 里调用
    this.boss = new Boss();
    (<any>window).boss = this.boss;

    // 进入模式选择试图
    this.selectMode();
  }

  /**
   * @description 游戏事件注册，包括的事件有：
   * 1. GAME_SELECT_MODE
   * 2. GAME_START
   * 3. GAME_VICTORY
   * 4. GAME_DEFEAT
   *
   * 此函数用于指定说当事件发生时，需要调用哪个函数进行处理。
   * 比如 GAME_SELECT_MODE 事件触发时，调用 selectMode 函数
   */
  private events(): void {
    // 禁用鼠标右键的默认行为，鼠标右键的点击将作为单元格的标记
    $(window).on('contextmenu', false);

    // 在 document 节点上注册事件
    $(document)
      .on(Events.GAME_SELECT_MODE, () => this.selectMode())
      .on(Events.GAME_START, (event: JQuery.Event, mode: IMode) => {
        this.start(event, mode);
      })
      .on(Events.GAME_VICTORY, () => this.victory())
      .on(Events.GAME_DEFEAT, () => this.defeat());
  }

  /**
   * @description 模式选择
   *
   * 激活前先销毁已经存在的 Mode 视图 和 Grid 视图
   */
  private selectMode(): void {
    this.deactivateModeView();
    this.deactivateGridView();
    this.activateModeView();

    // 禁用 Header 的 Restart 按钮
    this.header.deactivateRestartButton();
  }

  /**
   * @description 开始游戏
   *
   * 同样在激活 Grid 视图之前需要先销毁可能存在的 Mode 视图和 Grid 视图
   *
   * @param {JQuery.Event} event
   * @param {IMode} mode
   */
  private start(event: JQuery.Event, mode: IMode): void {
    this.deactivateModeView();
    this.deactivateGridView();
    this.activateGridView(mode);

    // 激活 Header 区域的 Restart 按钮
    this.header.activateRestartButton(mode);

    // 告诉 Boss 当前游戏的信息
    this.boss.know(this.gridView.expose());
  }

  /**
   * @description 激活 Mode 视图
   */
  private activateModeView(): void {
    // 实例化 ModeView
    this.modeView = new ModeView();

    // 将 ModeView 的画布添加到 Game 的画布上
    this.canvas.append(this.modeView.canvas);

    // 渲染 ModeView
    this.modeView.render();
  }

  /**
   * @description 销毁 Mode 视图
   */
  private deactivateModeView(): void {
    // 先判断 Mode 视图是否存在
    if (this.modeView) {
      this.modeView.destroy();
    }
  }

  /**
   * @description 激活 Grid 视图
   * @param {IMode} mode
   */
  private activateGridView(mode: IMode): void {
    // 实例化 Grid 视图
    this.gridView = new GridView(mode);

    // 将 Grid 视图的画布添加到 Game 的画布上
    this.canvas.append(this.gridView.canvas);

    // 渲染 Grid 视图
    this.gridView.render();
  }

  /**
   * @description 销毁 Grid 视图
   */
  private deactivateGridView(): void {
    if (this.gridView) {
      this.gridView.destroy();
    }
  }

  /**
   * @description 游戏失败
   */
  private defeat(): void {
    // 播放音效
    this.sfxDefeat.play();

    // 冻结 Grid 视图，禁止玩家对 Grid 视图再做操作
    this.gridView.freeze(false);
  }

  /**
   * @description 游戏胜利
   */
  private victory(): void {
    // 播放音效
    this.sfxVictory.play();

    // 冻结 Grid 视图，禁止玩家对 Grid 视图再做操作
    this.gridView.freeze(true);
  }
}
