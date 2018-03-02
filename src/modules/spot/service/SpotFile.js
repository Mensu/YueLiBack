import { File } from '../../file/service';

export class SpotFile extends File {
  /**
   *
   * @param {number} spot_id
   */
  constructor(spot_id) {
    super(`spot-${spot_id}-bg`);
  }
}
