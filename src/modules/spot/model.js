import { query } from '../db/service';
import { jsonParseProp, has } from '../../utils';

/**
 * @param {Spot} spot
 */
function refactorRawSpot(spot) {
  jsonParseProp(spot, 'location');
  if (has(spot, 'favorited')) {
    spot.favorited = Boolean(spot.favorited);
  }
  return spot;
}

/**
 * @param {number} spot_id
 * @param {number} user_id
 */
export async function findById(spot_id, user_id) {
  const sql = `
SELECT spot.spot_id, name, description, city, location,
        rank, myrank,
        IF(favorited IS NULL, FALSE, TRUE) AS favorited
  FROM spot
    LEFT JOIN
      (SELECT spot_id, AVG(rank) AS rank
        FROM spot_rank
        GROUP BY spot_id
      ) AS spot_avg_rank
      ON spot.spot_id = spot_avg_rank.spot_id
    LEFT JOIN
      (SELECT spot_id, rank AS myrank
        FROM spot_rank
        WHERE user_id = ?
      ) AS spot_my_rank
      ON spot.spot_id = spot_my_rank.spot_id
    LEFT JOIN
      (SELECT spot_id, user_id AS favorited
        FROM spot_favorite
        WHERE user_id = ?
      ) AS spot_favorited
      ON spot.spot_id = spot_favorited.spot_id
  WHERE spot.spot_id = ?
;
`;
  const values = [user_id, user_id, spot_id];
  /** @type {[Spot]} */
  const [spot] = await query(sql, values);
  return refactorRawSpot(spot);
}

/**
 * @param {number} user_id
 */
export async function findList(user_id) {
  const sql = `
SELECT spot.spot_id, name, description, city, location, rank
  FROM spot
    LEFT JOIN
      (SELECT spot_id, AVG(rank) AS rank
        FROM spot_rank
        GROUP BY spot_id
      ) AS spot_avg_rank
      ON spot.spot_id = spot_avg_rank.spot_id
;
`;
  const values = [user_id];
  /** @type {Spot[]} */
  const spots = await query(sql, values);
  return spots.map(refactorRawSpot);
}

/**
 * @param {number} spot_id
 * @param {number} user_id
 */
export async function favorite(spot_id, user_id) {
  const sql = `
INSERT INTO spot_favorite
  SET ?
  ON DUPLICATE KEY UPDATE ?
;
`;
  const props = { spot_id, user_id };
  const values = [props, props];
  return query(sql, values);
}

/**
 * @param {number} spot_id
 * @param {number} user_id
 */
export async function unfavorite(spot_id, user_id) {
  const sql = `
DELETE FROM spot_favorite
  WHERE spot_id = ? AND user_id = ?
;
`;
  const values = [spot_id, user_id];
  return query(sql, values);
}

/**
 *
 * @param {number} spot_id
 * @param {number} user_id
 * @param {number} rank
 */
export async function rank(spot_id, user_id, rank) {
  const sql = `
INSERT INTO spot_rank
  SET ?, rank = ?
  ON DUPLICATE KEY UPDATE rank = ?
;
`;
  const props = { spot_id, user_id };
  const values = [props, rank, rank];
  return query(sql, values);
}