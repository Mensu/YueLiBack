import * as FeelingServ from './service';
import * as FeelingModel from './model';
import * as CommentModel from '../comment/model';
import { jsonParse, assign, has, jsonParseProp } from '../../utils';

const { FeelingFile } = FeelingServ;

/**
 * 获取心情列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getFeelingsList(ctx, next) {
  const { query } = ctx.paramData;
  if (has(query, 'longitude')) {
    jsonParseProp(query, 'longitude');
  }
  if (has(query, 'latitude')) {
    jsonParseProp(query, 'latitude');
  }
  const records = await FeelingModel.findList(query);
  return ctx.setResp('获取心情列表成功', records);
}

/**
 * 创建新的心情
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function create(ctx, next) {
  const { curUser: { user_id }, file, body } = ctx.paramData;
  const feeling_id = await FeelingModel.create({ user_id, ...body });
  const uploader = new FeelingFile(feeling_id);
  await uploader.upload(file.buffer);
  return ctx.setResp('发表心情成功', { feeling_id });
}

/**
 * 解析 feeling_id
 * @param {Context} ctx
 * @param {INext}   next
 * @param {string}  id
 */
export async function parseFeelingId(ctx, next, id) {
  const feeling_id = Number(id);
  const feeling = await FeelingServ.retrieveFeeling(feeling_id);
  assign(ctx.paramData, { feeling });
  return next();
}

/**
 * 获取心情图片
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getFeelingPhoto(ctx, next) {
  const { feeling_id } = ctx.paramData.feeling;
  const downloader = new FeelingFile(feeling_id);
  ctx.body = await downloader.download();
  ctx.body.msg = '获取心情图片';
}

/**
 * 删除心情
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function del(ctx, next) {
  const { feeling_id } = ctx.paramData.feeling;
  await FeelingModel.del(feeling_id);
  return ctx.setResp('删除心情成功');
}

/**
 * 获取心情评论列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getCommentsList(ctx, next) {
  const { feeling_id } = ctx.paramData.feeling;
  const comments = await CommentModel.getComments('feeling', feeling_id);
  return ctx.setResp('获取评论列表成功', comments);
}

/**
 * 发表某心情的评论
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function comment(ctx, next) {
  const {
    curUser: { user_id },
    feeling: { feeling_id },
    body,
  } = ctx.paramData;
  const props = { user_id, ...body };
  await CommentModel.comment('feeling', feeling_id, props);
  return ctx.setResp('评论成功');
}
