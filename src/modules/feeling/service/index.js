import * as FeelingModel from '../model';
import * as auth from './auth';
import * as validate from './validate';
import { AE } from '../../../utils';

export { auth as require, validate };
export * from './FeelingFile';

/**
 * 根据 feeling 获取心情，心情不存在则抛出异常
 * @param {number} feeling_id
 */
export async function retrieveFeeling(feeling_id) {
  const feeling = await FeelingModel.findById(feeling_id);

  if (!feeling) {
    throw new AE.SoftError(AE.NOT_FOUND, `心情${feeling_id}不存在`);
  }

  return feeling;
}
