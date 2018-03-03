import { AE } from '../../../utils';
import * as SpotModel from '../../spot/model';

/**
 * 验证 spot_id 的合法性
 * @param {ParamData} paramData
 */
export async function spot_id(paramData) {
  const { body } = paramData;
  body.spot_id = Number(body.spot_id);
  const spot = await SpotModel.findById(body.spot_id, 0);
  if (!spot) {
    throw new AE.SoftError(AE.BAD_REQUEST, '该景点不存在');
  }
}
