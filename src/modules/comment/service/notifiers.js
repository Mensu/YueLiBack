import { Notifier, Type, Polulator } from '../../notification/service';
import * as TravelModel from '../../travel/model';
import * as FeelingModel from '../../feeling/model';
import * as CommentModel from '../model';
import { assign } from '../../../utils';

export class CommentCommentNotifier extends Notifier {
  genType() {
    const self = this;
    return Type.CommentComment;
  }

  genContent() {
    /** @type {{ reply_to_id: number }} */
    const { reply_to_id } = this.paramData.body;
    return { reply_to_id };
  }

  /**
   * 收集 ID
   * @param {Polulator} populator
   * @param {any} content
   */
  static gatherID(populator, content) {
    populator.user_id.add(content.sender_id);
    populator.comment_id.add(content.reply_to_id);
  }

  /**
   * 渲染 content
   * @param {Polulator} populator
   * @param {any} content
   */
  static populate(populator, content) {
    assign(content, { content: populator.comment_content[content.reply_to_id] });
  }

  async getReceivers() {
    /** @type {{ reply_to_id: number }} */
    const { reply_to_id } = this.paramData.body;
    if (reply_to_id === null) {
      return [];
    }
    const { user_id } = await CommentModel.findById(reply_to_id);
    return [user_id];
  }
}

class CommentNotifier extends Notifier {
  async notify() {
    /** @type {{ reply_to_id: number }} */
    const { reply_to_id } = this.paramData.body;
    if (reply_to_id === null) {
      return super.notify();
    }
    return new CommentCommentNotifier(this.paramData).notify();
  }
}

export class CommentTravelNotifier extends CommentNotifier {
  genType() {
    const self = this;
    return Type.CommentTravel;
  }

  genContent() {
    const { travel_id } = this.paramData.travel;
    return { travel_id };
  }

  /**
   * 收集 ID
   * @param {Polulator} populator
   * @param {any} content
   */
  static gatherID(populator, content) {
    populator.user_id.add(content.sender_id);
    populator.travel_id.add(content.travel_id);
  }

  /**
   * 渲染 content
   * @param {Polulator} populator
   * @param {any} content
   */
  static populate(populator, content) {
    assign(content, { title: populator.title[content.travel_id] });
  }

  async getReceivers() {
    const { travel_id } = this.paramData.travel;
    const { user_id } = await TravelModel.findById(travel_id);
    return [user_id];
  }
}

export class CommentFeelingNotifier extends CommentNotifier {
  genType() {
    const self = this;
    return Type.CommentFeeling;
  }

  genContent() {
    const { feeling_id } = this.paramData.feeling;
    return { feeling_id };
  }

  /**
   * 收集 ID
   * @param {Polulator} populator
   * @param {any} content
   */
  static gatherID(populator, content) {
    populator.user_id.add(content.sender_id);
    populator.feeling_id.add(content.feeling_id);
  }

  /**
   * 渲染 content
   * @param {Polulator} populator
   * @param {any} content
   */
  static populate(populator, content) {
    assign(content, { content: populator.feeling_content[content.feeling_id] });
  }

  async getReceivers() {
    const { feeling_id } = this.paramData.feeling;
    const { user_id } = await FeelingModel.findById(feeling_id);
    return [user_id];
  }
}
