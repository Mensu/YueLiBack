import { query } from '../db/service';
import { has, pick } from '../../utils';

/**
 * @param {(Travel & TravelRecord)[]} rawTravels
 */
function refactorRawTravels(rawTravels) {
  /** @type {Travel[]} */
  const travels = [];
  let curTravelId = null;
  for (const one of rawTravels) {
    if (one.travel_id !== curTravelId) {
      const travel = pick(one,
        'travel_id', 'user_id', 'nickname', 'title', 'first_day',
        'favorite_count', 'favorited', 'comment_count', 'records',
      );
      curTravelId = travel.travel_id;
      travel.favorited = Boolean(travel.favorited);
      travel.records = [];
      travels.push(travel);
    }
    const curTravel = travels[travels.length - 1];
    const record = pick(one, 'travel_record_id', 'spot_id', 'spot_name', 'content', 'time');
    curTravel.records.push(record);
  }
  return travels;
}

/**
 * @param {{ user_id?: number, spot_id?: number }} filter
 * @param {number} user_id 当前用户
 */
export async function findList(filter, user_id) {
  let userFilter = '';
  let spotFilter = '';
  const values = [user_id];
  if (has(filter, 'user_id')) {
    userFilter = 'AND travel.user_id = ?';
    values.push(filter.user_id);
  }
  if (has(filter, 'spot_id')) {
    spotFilter = `
  INNER JOIN
    (SELECT travel_id, MIN(spot_id)
      FROM travel_record
      WHERE spot_id = ? AND travel_record.is_deleted = 0
      GROUP BY travel_id
    ) AS travel_record_spot
    ON travel.travel_id = travel_record_spot.travel_id
`;
    values.unshift(filter.spot_id);
  }

  const sql = `
SELECT travel.travel_id, user.user_id, user.nickname, travel.title, travel.first_day,
        COALESCE(favorite_count, 0) AS favorite_count,
        IF(travel_favorited.user_id IS NULL, FALSE, TRUE) AS favorited,
        COALESCE(comment_count, 0) AS comment_count,
        travel_record_id, spot.spot_id, spot.name AS spot_name, content, time
  FROM travel
    INNER JOIN user
      ON travel.user_id = user.user_id
    ${spotFilter}
    LEFT JOIN
      (SELECT travel_id, COUNT(user_id) AS favorite_count
        FROM travel_favorite
        GROUP BY travel_id
      ) AS travel_favorite_count
      ON travel.travel_id = travel_favorite_count.travel_id
    LEFT JOIN
      (SELECT travel_id, user_id
        FROM travel_favorite
        WHERE user_id = ?
      ) AS travel_favorited
      ON travel.travel_id = travel_favorited.travel_id
    LEFT JOIN
      (SELECT travel_id, COUNT(comment_id) AS comment_count
        FROM travel_comment
        GROUP BY travel_id
      ) AS travel_comment_count
      ON travel.travel_id = travel_comment_count.travel_id
    LEFT JOIN travel_record
      ON travel.travel_id = travel_record.travel_id
    LEFT JOIN spot
      ON travel_record.spot_id = spot.spot_id
  WHERE travel.is_deleted = 0
    AND travel_record.is_deleted = 0
    ${userFilter}
;
`;
  /** @type {(Travel & TravelRecord)[]} */
  const rawTravels = await query(sql, values);
  return refactorRawTravels(rawTravels);
}

/**
 * @param {number} travel_id
 */
export async function findById(travel_id) {
  const sql = `
SELECT travel.travel_id, travel.title, travel.first_day
  FROM travel
  WHERE travel_id = ? AND travel.is_deleted = 0
;
`;
  const values = [travel_id];
  /** @type {[Travel]} */
  const [travel] = await query(sql, values);
  return travel;
}

/**
 * @param {TravelEditableProps & { user_id: number }} props
 */
export async function create(props) {
  const sql = `
INSERT INTO travel
  SET ?
;
`;
  props = pick(props, 'user_id', 'title', 'first_day');
  if (has(props, 'first_day')) {
    props.first_day = new Date(props.first_day);
  }
  /** @type {InsertResult} */
  const { insertId } = await query(sql, [props]);
  return insertId;
}

/**
 * @param {number} travel_id
 * @param {TravelEditableProps} props
 */
export async function update(travel_id, props) {
  const sql = `
UPDATE travel
  SET ?
  WHERE travel_id = ?
;
`;
  props = pick(props, 'title', 'first_day');
  if (has(props, 'first_day')) {
    props.first_day = new Date(props.first_day);
  }
  const values = [props, travel_id];
  return query(sql, values);
}

/**
 * @param {number} travel_id
 */
export async function del(travel_id) {
  const sql = `
UPDATE travel
  SET is_deleted = 1
  WHERE travel_id = ?
;
`;
  const values = [travel_id];
  return query(sql, values);
}

/**
 * @param {number} travel_id
 * @param {number} user_id
 */
export async function favorite(travel_id, user_id) {
  const sql = `
INSERT INTO travel_favorite
  SET ?
  ON DUPLICATE KEY UPDATE ?
;
`;
  const props = { travel_id, user_id };
  const values = [props, props];
  return query(sql, values);
}

/**
 * @param {number} travel_id
 * @param {number} user_id
 */
export async function unfavorite(travel_id, user_id) {
  const sql = `
DELETE FROM travel_favorite
  WHERE travel_id = ? AND user_id = ?
;
`;
  const values = [travel_id, user_id];
  return query(sql, values);
}
