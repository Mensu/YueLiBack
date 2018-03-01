import { query, transaction } from '../db/service';
import { pick } from '../../utils';

/**
 * @typedef {Object} ReplyToProps
 * @property {number} reply_to_user_id
 * @property {string} reply_to_nickname
 * @property {string} reply_to_content
 * @param {Comment & ReplyToProps} rawComment
 * @return {Comment}
 */
function refactorRawComment(rawComment) {
  const {
    reply_to_user_id: user_id,
    reply_to_nickname: nickname,
    reply_to_content: content,
    ...comment
  } = rawComment;
  comment.reply_to = user_id === null ? null : { user_id, nickname, content };
  return comment;
}

/**
 * @param {CommentType} type
 * @param {number} id
 */
export async function getComments(type, id) {
  const tableName = `${type}_comment`;
  const idName = `${type}_id`;
  const sql = `
SELECT comment.comment_id, user.user_id, user.nickname, comment.content,
        reply_to_user.user_id AS reply_to_user_id, reply_to_user.nickname AS reply_to_nickname, reply_to_comment.content AS reply_to_content,
        comment.time
  FROM ??
    INNER JOIN comment
      ON ??.comment_id = comment.comment_id
    INNER JOIN user
      ON comment.user_id = user.user_id
    LEFT JOIN comment AS reply_to_comment
      ON comment.reply_to_id = reply_to_comment.comment_id
    LEFT JOIN user AS reply_to_user
      ON reply_to_comment.user_id = reply_to_user.user_id
  WHERE ??.?? = ?
;
`;
  const values = [tableName, tableName, tableName, idName, id];
  /** @type {(Comment & ReplyToProps)[]} */
  const rawComments = await query(sql, values);
  return rawComments.map(refactorRawComment);
}

/**
 * @param {CommentType} type
 * @param {number} id
 * @param {{ user_id: number, reply_to_id: number, content: string }} props
 */
export async function comment(type, id, props) {
  const tableName = `${type}_comment`;
  const idName = `${type}_id`;
  const sql = `
INSERT INTO ??
  SET ?
;
`;
  props = pick(props, 'user_id', 'reply_to_id', 'content');
  /** @type {number} */
  let comment_id;
  await transaction(insertComment);
  return comment_id;

  async function insertComment(conn) {
    /** @type {InsertResult} */
    ({ insertId: comment_id } = await query(sql, ['comment', props], conn));
    await query(sql, [tableName, { comment_id, [idName]: id }], conn);
  }
}
