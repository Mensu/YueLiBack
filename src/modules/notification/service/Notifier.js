import util from 'util';
import * as NotiModel from '../model';
import * as selfPkg from './Notifier';
import { Polulator } from '.';
import { pick } from '../../../utils';

export class Notifier {
  /**
   * 重写 getType、getContent 以及 getReceivers
   * @param {ParamData} paramData
   */
  constructor(paramData) {
    const { user_id } = paramData.curUser;
    this.sender_id = user_id;
    this.paramData = paramData;
    this.type = this.genType();
    this.content = this.genContent();
  }

  /**
   * 生成通知 type 字段
   */
  genType() {
    const self = this;
    return '';
  }

  /**
   * 生成通知 content 字段
   */
  genContent() {
    const self = this;
    return {};
  }

  /**
   * 收集 ID
   * @param {Polulator} populator
   * @param {any} content
   */
  static gatherID(populator, content) {
    // ...
  }

  /**
   * 渲染 content
   * @param {Polulator} populator
   * @param {any} content
   */
  static populate(populator, content) {
    // ...
  }

  /**
   * 获取通知接收方的列表
   * @return {Promise<number[]>}
   */
  async getReceivers() {
    const self = this;
    return [];
  }

  async notify() {
    const user_id = await this.getReceivers();
    if (user_id.length === 0) return;
    const props = pick(this, 'sender_id', 'type', 'content');
    await NotiModel.create(props, user_id);
  }

  /**
   * @param {typeof Notifier} Notifier
   * @return {IMiddleware}
   */
  static toMid(Notifier) {
    if (Notifier.prototype instanceof selfPkg.Notifier === false) {
      throw new TypeError(`传进 Notifier.toMid 的 ${util.inspect(Notifier)} 不是具体的 Notifier`);
    }
    return async (ctx, next) => {
      const notifier = new Notifier(ctx.paramData);
      await notifier.notify();
      return next();
    };
  }
}
