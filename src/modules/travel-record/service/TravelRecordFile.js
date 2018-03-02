import { File } from '../../file/service';

export class TravelRecordFile extends File {
  /**
   *
   * @param {number} travel_record_id
   */
  constructor(travel_record_id) {
    super(`travel-record-${travel_record_id}`);
  }
}
