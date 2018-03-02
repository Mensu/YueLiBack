import { AE } from '../../../utils';
import * as SpotModel from '../model';

export * from './SpotFile';


/**
 * 根据 spot_id 获取景点，景点不存在则抛出异常
 * @param {number} spot_id
 * @param {number} [user_id]
 */
export async function retrieveSpot(spot_id, user_id = 0) {
  const spot = await SpotModel.findById(spot_id, user_id);

  if (!spot) {
    throw new AE.SoftError(AE.NOT_FOUND, `景点${spot_id}不存在`);
  }

  return spot;
}
