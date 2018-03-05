import { Notifier, Type, Polulator } from '../../notification/service';
import { assign } from '../../../utils';

export class FavTravelNotifier extends Notifier {
  genType() {
    const self = this;
    return Type.FavoriteTravel;
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
    const { user_id } = this.paramData.travel;
    return [user_id];
  }
}
