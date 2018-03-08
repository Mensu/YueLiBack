import { AE } from '../../../utils';

/**
 * 要求当前用户是心情的作者
 * @param {ParamData} paramData
 */
export async function authorIsCurUser(paramData) {
  const { curUser, feeling } = paramData;
  if (curUser.user_id !== feeling.user_id) {
    throw new AE.SoftError(AE.NO_PERMISSION, '您只能操作自己的心情');
  }
}
