import { AE } from '../../../utils';
import * as UserServ from '.';

/**
 * 要求用户已登录
 * @param {ParamData} paramData
 */
export async function isLoggedIn(paramData) {
  const { session } = paramData;
  if (!session.user_id) {
    throw new AE.SoftError(AE.NOT_AUTHORIZED, '未登录');
  }
  const user = await UserServ.retrieveUser(session.user_id);
  paramData.curUser = user;
}

/**
 * 要求操作的是当前用户
 * @param {ParamData} paramData
 */
export async function isCurUser(paramData) {
  const { curUser, user } = paramData;
  if (curUser.user_id !== user.user_id) {
    throw new AE.SoftError(AE.NO_PERMISSION, '您只能操作自己的数据');
  }
}
