import { File } from '../../file/service';

export class TravelFile extends File {
  /**
   *
   * @param {number} travel_id
   */
  constructor(travel_id) {
    super(`travel-${travel_id}-cover`);
  }
}
