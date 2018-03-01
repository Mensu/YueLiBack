import { query } from '../db/service';
import { pick } from '../../utils';

/**
 * @param {number} user_id
 */
export async function findById(user_id) {
  const sql = `
SELECT user_id, username, password,
        nickname, signature
  FROM user
  WHERE user_id = ?
;
`;
  const values = [user_id];
  /** @type {[User]} */
  const [user] = await query(sql, values);
  return user;
}

/**
 * @param {string} username
 */
export async function findByUsername(username) {
  const sql = `
SELECT user_id, username, password,
        nickname, signature
  FROM user
  WHERE username = ?
;
`;
  const values = [username];
  /** @type {[User]} */
  const [user] = await query(sql, values);
  return user;
}

/**
 * @param {UserCredentials} credentials
 */
export async function register(credentials) {
  const sql = `
INSERT INTO user
  SET ?
;
`;
  const props = pick(credentials, 'username', 'password');
  const values = [props];
  /** @type {InsertResult} */
  const { insertId } = await query(sql, values);
  return insertId;
}

/**
 * @param {number} user_id
 * @param {UserEditableProps} props
 */
export async function update(user_id, props) {
  const sql = `
UPDATE user
  SET ?
  WHERE user_id = ?
;
`;
  props = pick(props, 'nickname', 'password', 'signature');
  const values = [props, user_id];
  return query(sql, values);
}

/**
 * @param {number} user_id
 */
export async function findFollowers(user_id) {
  const sql = `
SELECT user.user_id, nickname, signature
  FROM user_follower
    INNER JOIN user
      ON user.user_id = user_follower.follower_id
  WHERE user_follower.user_id = ?
;
`;
  const values = [user_id];
  /** @type {UserFollower[]} */
  const followers = await query(sql, values);
  return followers;
}

/**
 * @param {number} follower_id
 * @param {number} user_id
 */
export async function checkIsFollowing(follower_id, user_id) {
  const sql = `
SELECT 1
  FROM user_follower
  WHERE follower_id = ? AND user_id = ?
;
`;
  const values = [follower_id, user_id];
  const [result] = await query(sql, values);
  return Boolean(result);
}

/**
 * @param {number} follower_id
 * @param {number} user_id
 */
export async function follow(follower_id, user_id) {
  const sql = `
INSERT INTO user_follower
  SET ?
  ON DUPLICATE KEY UPDATE ?
;
`;
  const props = { user_id, follower_id };
  const values = [props, props];
  return query(sql, values);
}

/**
 * @param {number} follower_id
 * @param {number} user_id
 */
export async function unfollow(follower_id, user_id) {
  const sql = `
DELETE FROM user_follower
  WHERE follower_id = ? AND user_id = ?
;
`;
  const values = [follower_id, user_id];
  return query(sql, values);
}
