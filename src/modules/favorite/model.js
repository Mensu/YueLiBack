import { query } from '../db/service';
import * as SpotModel from '../spot/model';
import * as TravelModel from '../travel/model';
import { assign } from '../../utils';

/**
 *
 * @param {number} user_id
 */
export async function findList(user_id) {
  const sql = `
SELECT travel_id AS id, time, 'travel' AS type
  FROM travel_favorite
  WHERE user_id = ?
UNION
SELECT spot_favorite.spot_id, time, 'spot'
  FROM spot_favorite
  WHERE user_id = ?
ORDER BY time DESC
;
`;
  const values = [user_id, user_id];
  /** @type {Favorite[]} */
  const list = await query(sql, values);
  const spot_id = list.filter(one => one.type === 'spot').map(one => one.id);
  const travel_id = list.filter(one => one.type === 'travel').map(one => one.id);
  const [spotMap, travelMap] = await Promise.all([
    (async () => {
      const spots = spot_id.length === 0 ? [] : await SpotModel.findList({ spot_id });
      /** @type {[number, Spot][]} */
      // @ts-ignore
      const it = spots.map(one => [one.spot_id, one]);
      return new Map(it);
    })(),
    (async () => {
      const filter = { travel_id };
      const travels = travel_id.length === 0 ? [] : await TravelModel.findList(filter, user_id);
      travels.forEach(one => delete one.records);
      /** @type {[number, Travel][]} */
      // @ts-ignore
      const it = travels.map(one => [one.travel_id, one]);
      return new Map(it);
    })(),
  ]);
  const map = {
    spot: spotMap,
    travel: travelMap,
  };
  for (const one of list) {
    assign(one, map[one.type].get(one.id));
    delete one.id;
    delete one.time;
  }
  return list;
}
