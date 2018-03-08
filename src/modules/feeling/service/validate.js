import { AE } from '../../../utils';

/**
 * 验证 longitude, latitude 的合法性
 * @param {ParamData} paramData
 */
export async function longlatitude(paramData) {
  const { body } = paramData;
  body.longitude = Number(body.longitude);
  body.latitude = Number(body.latitude);
  if (body.longitude < -180 || body.longitude > 180) {
    throw new AE.SoftError(AE.BAD_REQUEST, '经度合法范围为 [-180, 180]');
  }
  if (body.latitude < -90 || body.latitude > 90) {
    throw new AE.SoftError(AE.BAD_REQUEST, '纬度合法范围为 [-90, 90]');
  }
}
