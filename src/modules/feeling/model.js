import { query } from '../db/service';
import { pick, has } from '../../utils';

/**
 * @typedef {Object} FeelingListFilter
 * @property {number[]} longitude
 * @property {number[]} latitude
 * @property {number} user_id
 * @param {FeelingListFilter} filter
 */
export async function findList(filter) {
  const { longitude, latitude, user_id } = filter;
  const values = [];
  let longitudeFilter = '';
  let latitudeFilter = '';
  let userFilter = '';
  if (has(filter, 'longitude')) {
    if (longitude[0] > longitude[1]) {
      longitudeFilter = 'AND (longitude BETWEEN ? AND ? OR longitude BETWEEN ? AND ?)';
      values.push(longitude[0], 180, -180, longitude[1]);
    } else {
      longitudeFilter = 'AND longitude BETWEEN ? AND ?';
      values.push(...longitude);
    }
  }
  if (has(filter, 'latitude')) {
    latitudeFilter = 'AND latitude BETWEEN ? AND ?';
    values.push(...latitude);
  }
  if (has(filter, 'user_id')) {
    userFilter = 'AND user.user_id = ?';
    values.push(user_id);
  }
  const sql = `
SELECT feeling_id, user.user_id, nickname, content, longitude, latitude, time
  FROM feeling
    INNER JOIN user
      ON feeling.user_id = user.user_id
  WHERE feeling.is_deleted = 0
    ${longitudeFilter}
    ${latitudeFilter}
    ${userFilter}
;
`;
  /** @type {Feeling[]} */
  const feelings = await query(sql, values);
  return feelings;
}

/**
 *
 * @param {number} feeling_id
 */
export async function findById(feeling_id) {
  const sql = `
SELECT feeling_id, user.user_id, nickname, content, longitude, latitude, time
  FROM feeling
    INNER JOIN user
      ON feeling.user_id = user.user_id
  WHERE feeling_id = ? AND feeling.is_deleted = 0
;
`;
  const values = [feeling_id];
  /** @type {[Feeling]} */
  const [feeling] = await query(sql, values);
  return feeling;
}

/**
 *
 * @param {FeelingEditableProps & { user_id: number, longitude: number, latitude: number }} props
 */
export async function create(props) {
  const sql = `
INSERT INTO feeling
  SET ?
;
`;
  props = pick(props, 'user_id', 'content', 'longitude', 'latitude');
  /** @type {InsertResult} */
  const { insertId } = await query(sql, [props]);
  return insertId;
}

/**
 * @param {number} feeling_id
 */
export async function del(feeling_id) {
  const sql = `
UPDATE feeling
  SET is_deleted = 1
  WHERE feeling_id = ?
;
`;
  const values = [feeling_id];
  return query(sql, values);
}
