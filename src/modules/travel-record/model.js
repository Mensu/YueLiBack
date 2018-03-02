import { query } from '../db/service';
import { has, pick } from '../../utils';

/**
 * @param {number} travel_record_id
 */
export async function findById(travel_record_id) {
  const sql = `
SELECT travel_record_id, travel.travel_id, user_id, spot_id, content, time
  FROM travel_record
    INNER JOIN travel
      ON travel_record.travel_id = travel.travel_id
  WHERE travel_record_id = ? AND travel_record.is_deleted = 0
;
`;
  const values = [travel_record_id];
  /** @type {[TravelRecord]} */
  const [travel_record] = await query(sql, values);
  return travel_record;
}

/**
 * @param {TravelRecordEditableProps & { travel_id: number }} props
 */
export async function create(props) {
  const sql = `
INSERT INTO travel_record
  SET ?
;
`;
  props = pick(props, 'travel_id', 'spot_id', 'content', 'time');
  if (has(props, 'time')) {
    props.time = new Date(props.time);
  }
  /** @type {InsertResult} */
  const { insertId } = await query(sql, [props]);
  return insertId;
}

/**
 * @param {number} travel_record_id
 * @param {TravelRecordEditableProps} props
 */
export async function update(travel_record_id, props) {
  const sql = `
UPDATE travel_record
  SET ?
  WHERE travel_record_id = ?
;
`;
  props = pick(props, 'spot_id', 'content', 'time');
  if (has(props, 'time')) {
    props.time = new Date(props.time);
  }
  const values = [props, travel_record_id];
  return query(sql, values);
}

/**
 * @param {number} travel_record_id
 */
export async function del(travel_record_id) {
  const sql = `
UPDATE travel_record
  SET is_deleted = 1
  WHERE travel_record_id = ?
;
`;
  const values = [travel_record_id];
  return query(sql, values);
}
