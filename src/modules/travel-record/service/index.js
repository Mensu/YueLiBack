import * as auth from './auth';
import * as validate from './validate';
import * as TRModel from '../model';
import { AE } from '../../../utils';

export * from './TravelRecordFile';
export { auth as require, validate };

/**
 * 根据 travel_record_id 获取游记，游记不存在则抛出异常
 * @param {number} travel_record_id
 */
export async function retrieveTravelRecord(travel_record_id) {
  const travel_record = await TRModel.findById(travel_record_id);

  if (!travel_record) {
    throw new AE.SoftError(AE.NOT_FOUND, `游记记录${travel_record_id}不存在`);
  }

  return travel_record;
}
