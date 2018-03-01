import { md5 } from '../../../utils';
import { salt } from '../../../config';

/**
 * 给密码加盐
 * @param {string} password
 */
export function addSalt(password) {
  return md5(`${password}${salt}`);
}

/**
 * 验证 user 和 password 是否匹配
 * @param {User} user
 * @param {string} password
 */
export function isPwdMatch(user, password) {
  return addSalt(password) === user.password;
}
