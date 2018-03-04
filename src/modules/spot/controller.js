import * as SpotServ from './service';
import * as SpotModel from './model';
import * as CommentModel from '../comment/model';
import { assign } from '../../utils';

const { SpotFile } = SpotServ;

/**
 * 获取景点列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getSpotsList(ctx, next) {
  const spots = await SpotModel.findList();
  return ctx.setResp('获取景点列表成功', spots);
}

/**
 * 解析 spot_id
 * @param {Context} ctx
 * @param {INext}   next
 * @param {string}  id
 */
export async function parseSpotId(ctx, next, id) {
  const spot_id = Number(id);
  const { user_id } = ctx.paramData.curUser;
  const spot = await SpotServ.retrieveSpot(spot_id, user_id);
  assign(ctx.paramData, { spot });
  return next();
}

/**
 * 获取景点信息
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getSpotInfo(ctx, next) {
  const { spot } = ctx.paramData;
  return ctx.setResp('获取景点信息成功', spot);
}

/**
 * 获取景点背景图
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getSpotBg(ctx, next) {
  const { spot_id } = ctx.paramData.spot;
  const downloader = new SpotFile(spot_id);
  ctx.body = await downloader.download();
  ctx.body.msg = '获取景点背景图';
}

/**
 * 收藏景点
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function favorite(ctx, next) {
  const {
    curUser: { user_id },
    spot: { spot_id },
  } = ctx.paramData;
  await SpotModel.favorite(spot_id, user_id);
  return ctx.setResp('收藏景点成功');
}

/**
 * 取消收藏景点
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function unfavorite(ctx, next) {
  const {
    curUser: { user_id },
    spot: { spot_id },
  } = ctx.paramData;
  await SpotModel.unfavorite(spot_id, user_id);
  return ctx.setResp('取消收藏景点成功');
}

/**
 * 给景点打分
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function rank(ctx, next) {
  const {
    curUser: { user_id },
    spot: { spot_id },
    body,
  } = ctx.paramData;
  await SpotModel.rank(spot_id, user_id, body.rank);
  return ctx.setResp('给景点打分成功');
}

/**
 * 获取景点评论列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getCommentsList(ctx, next) {
  const { spot_id } = ctx.paramData.spot;
  const comments = await CommentModel.getComments('spot', spot_id);
  return ctx.setResp('获取评论列表成功', comments);
}

/**
 * 发表某景点的评论
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function comment(ctx, next) {
  const {
    curUser: { user_id },
    spot: { spot_id },
    body,
  } = ctx.paramData;
  const props = { user_id, ...body };
  await CommentModel.comment('spot', spot_id, props);
  return ctx.setResp('评论成功');
}
