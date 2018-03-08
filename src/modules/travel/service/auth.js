import { AE } from '../../../utils';

/**
 * 要求当前用户是游记的作者
 * @param {ParamData} paramData
 */
export async function authorIsCurUser(paramData) {
  const { curUser, travel } = paramData;
  if (curUser.user_id !== travel.user_id) {
    throw new AE.SoftError(AE.NO_PERMISSION, '您只能操作自己的游记');
  }
}
