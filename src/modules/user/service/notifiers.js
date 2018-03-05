import { Notifier, Type, Polulator } from '../../notification/service';
import * as UserModel from '../model';
import { assign } from '../../../utils';

export class FollowUserNotifier extends Notifier {
  genType() {
    const self = this;
    return Type.FollowUser;
  }

  /**
   * 收集 ID
   * @param {Polulator} populator
   * @param {any} content
   */
  static gatherID(populator, content) {
    populator.user_id.add(content.sender_id);
  }

  async getReceivers() {
    const { user_id } = this.paramData.user;
    return [user_id];
  }
}

class PostNewNotifier extends Notifier {
  async getReceivers() {
    const followers = await UserModel.findFollowers(this.sender_id);
    return followers.map(one => one.user_id);
  }
}

export class PostTravelNotifier extends PostNewNotifier {
  genType() {
    const self = this;
    return Type.PostTravel;
  }

  genContent() {
    const { travel_id } = this.paramData;
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
}

export class PostFeelingNotifier extends PostNewNotifier {
  genType() {
    const self = this;
    return Type.PostFeeling;
  }

  genContent() {
    const { feeling_id } = this.paramData;
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
}
