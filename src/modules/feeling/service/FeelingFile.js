import { File } from '../../file/service';

export class FeelingFile extends File {
  /**
   *
   * @param {number} feeling_id
   */
  constructor(feeling_id) {
    super(`feeling-${feeling_id}`);
  }
}
