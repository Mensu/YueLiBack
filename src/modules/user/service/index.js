import * as auth from './auth';
import { pick, AE } from '../../../utils';
import * as UserModel from '../model';

export { auth as require };
export * from './password';
export * from './UserFile';

/**
 * 根据 user_id 或 username 获取用户，用户不存在则抛出异常
 * @param {number|string} id
 * @param {boolean} [withPassword] true
 */
export async function retrieveUser(id, withPassword = true) {
  let user;
  if (typeof id === 'number') {
    user = await UserModel.findById(id);
  } else {
    user = await UserModel.findByUsername(id);
  }

  if (!user) {
    throw new AE.SoftError(AE.NOT_FOUND, `用户${id}不存在`);
  }

  return refactorUser(user, withPassword);
}

/**
 * 获取用户
 * @param {User} user
 * @param {boolean} [withPassword] true
 */
export function refactorUser(user, withPassword = true) {
  if (!withPassword) {
    delete user.password;
  }
  return user;
}
