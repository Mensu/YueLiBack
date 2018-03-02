import * as auth from './auth';
import * as TravelModel from '../model';
import { AE } from '../../../utils';

export * from './TravelFile';
export { auth as require };

/**
 * 根据 travel_id 获取游记，游记不存在则抛出异常
 * @param {number} travel_id
 */
export async function retrieveTravel(travel_id) {
  const travel = await TravelModel.findById(travel_id);

  if (!travel) {
    throw new AE.SoftError(AE.NOT_FOUND, `游记${travel_id}不存在`);
  }

  return travel;
}
