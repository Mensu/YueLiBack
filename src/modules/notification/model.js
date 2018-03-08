import _ from 'lodash';
import { query, transaction } from '../db/service';
import { pick, assign, jsonParseProp } from '../../utils';

/**
 *
 * @param {NotificationEditableProps & { sender_id: number }} props
 * @param {number[]} user_id 消息接收方
 */
export async function create(props, user_id) {
  if (user_id.length === 0) return;
  const sql = `
INSERT INTO notification_read
  (user_id, notification_id)
  VALUES
${user_id.map(() => '  (?, ?)').join('\n')}
;
`;
  /** @type {number} */
  let notification_id;
  await transaction(async (conn) => {
    props = pick(props, 'sender_id', 'type', 'content');
    assign(props, { content: JSON.stringify(props.content) });
    ({ insertId: notification_id } = await query('INSERT INTO notification SET ?;', [props], conn));

    return query(sql, _.flatten(user_id.map(u => [u, notification_id])), conn);
  });
  return notification_id;
}

/**
 *
 * @param {number|number[]} notification_id
 * @param {boolean} is_read
 */
export async function changeState(notification_id, is_read) {
  if (Array.isArray(notification_id) && notification_id.length === 0) return;
  const sql = `
UPDATE notification_read
  SET is_read = ?
  WHERE notification_id IN (?)
;
`;
  return query(sql, [is_read, notification_id]);
}

/**
 * @param {number} user_id
 */
export async function findList(user_id) {
  const sql = `
SELECT notification.notification_id, sender_id, type, time, content, is_read
  FROM notification
    INNER JOIN notification_read
      ON notification.notification_id = notification_read.notification_id
  WHERE notification_read.user_id = ?
;
`;
  /** @type {Notification[]} */
  const notifications = await query(sql, [user_id]);
  notifications.forEach(one => jsonParseProp(one, 'content'));
  return notifications;
}
