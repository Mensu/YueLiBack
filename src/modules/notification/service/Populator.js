import * as UserModel from '../../user/model';
import * as SpotModel from '../../spot/model';
import * as TravelModel from '../../travel/model';
import * as FeelingModel from '../../feeling/model';
import * as CommModel from '../../comment/model';
import { arr2Map, assign, pick } from '../../../utils';
import { Notifier, Type } from '.';
import { CommentCommentNotifier, CommentTravelNotifier, CommentFeelingNotifier } from '../../comment/service';
import { FavTravelNotifier } from '../../travel/service';
import { FollowUserNotifier, PostTravelNotifier, PostFeelingNotifier } from '../../user/service';

export class Polulator {
  constructor() {
    /** @type {Set<number>} */
    this.user_id = new Set();
    /** @type {Object<number, string>} */
    this.nickname = {};

    /** @type {Set<number>} */
    this.spot_id = new Set();
    /** @type {Object<number, string>} */
    this.spot_name = {};

    /** @type {Set<number>} */
    this.travel_id = new Set();
    /** @type {Object<number, string>} */
    this.title = {};

    /** @type {Set<number>} */
    this.feeling_id = new Set();
    /** @type {Object<number, string>} */
    this.feeling_content = {};

    /** @type {Set<number>} */
    this.comment_id = new Set();
    /** @type {Object<number, string>} */
    this.comment_content = {};
  }

  /**
   *
   * @param {Notification[]} notifications
   */
  async polulate(notifications) {
    /** @type {{ [type: string]: typeof Notifier }} */
    const notifier = {
      [Type.CommentComment]: CommentCommentNotifier,
      [Type.CommentTravel]: CommentTravelNotifier,
      [Type.CommentFeeling]: CommentFeelingNotifier,
      [Type.FavoriteTravel]: FavTravelNotifier,
      [Type.FollowUser]: FollowUserNotifier,
      [Type.PostTravel]: PostTravelNotifier,
      [Type.PostFeeling]: PostFeelingNotifier,
    };

    // gathering
    for (const one of notifications) {
      assign(one.content, pick(one, 'sender_id'));
      notifier[one.type].gatherID(this, one.content);
    }

    // query db
    const [users, spots, travels, feelings, comments] = await Promise.all([
      UserModel.findNameById([...this.user_id]),
      SpotModel.findNameById([...this.spot_id]),
      TravelModel.findNameById([...this.travel_id]),
      FeelingModel.findNameById([...this.feeling_id]),
      CommModel.findNameById([...this.comment_id]),
    ]);
    this.nickname = arr2Map(users, 'user_id', 'nickname');
    this.spot_name = arr2Map(spots, 'spot_id', 'name');
    this.title = arr2Map(travels, 'travel_id', 'title');
    this.feeling_content = arr2Map(feelings, 'feeling_id', 'content');
    this.comment_content = arr2Map(comments, 'comment_id', 'content');

    // populate
    for (const one of notifications) {
      assign(one, { sender: this.nickname[one.sender_id] });
      notifier[one.type].populate(this, one.content);
      delete one.content.sender_id;
    }

    return notifications;
  }
}
