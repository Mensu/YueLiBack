import * as TravelServ from './service';
import * as TravelModel from './model';
import * as CommentModel from '../comment/model';
import { assign } from '../../utils';

const { TravelFile } = TravelServ;

/**
 * 创建新的游记
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function create(ctx, next) {
  const { curUser: { user_id }, file, body } = ctx.paramData;
  const travel_id = await TravelModel.create({ user_id, ...body });
  const uploader = new TravelFile(travel_id);
  await uploader.upload(file.buffer);
  return ctx.setResp('创建游记成功', { travel_id });
}

/**
 * 获取游记列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getTravelsList(ctx, next) {
  const { curUser: { user_id }, query } = ctx.paramData;
  const travels = await TravelModel.findList(query, user_id);
  return ctx.setResp('获取游记列表成功', travels);
}

/**
 * 解析 travel_id
 * @param {Context} ctx
 * @param {INext}   next
 * @param {string}  id
 */
export async function parseTravelId(ctx, next, id) {
  const travel_id = Number(id);
  const travel = await TravelServ.retrieveTravel(travel_id);
  assign(ctx.paramData, { travel });
  return next();
}

/**
 * 获取游记封面图
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getTravelCover(ctx, next) {
  const { travel_id } = ctx.paramData.travel;
  const downloader = new TravelFile(travel_id);
  ctx.body = await downloader.download();
  ctx.body.msg = '获取游记封面图';
}

/**
 * 修改游记
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function update(ctx, next) {
  const { travel: { travel_id }, file, body } = ctx.paramData;

  /** @type {Promise[]} */
  const tasks = [];
  if (file) {
    const uploader = new TravelFile(travel_id);
    tasks.push(uploader.upload(file.buffer));
  }
  if (Object.keys(body).length > 0) {
    tasks.push(TravelModel.update(travel_id, { ...body }));
  }
  await Promise.all(tasks);
  return ctx.setResp('修改游记成功');
}

/**
 * 删除游记
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function del(ctx, next) {
  const { travel_id } = ctx.paramData.travel;
  await TravelModel.del(travel_id);
  return ctx.setResp('删除游记成功');
}

/**
 * 收藏游记
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function favorite(ctx, next) {
  const {
    curUser: { user_id },
    travel: { travel_id },
  } = ctx.paramData;
  await TravelModel.favorite(travel_id, user_id);
  return ctx.setResp('收藏游记成功');
}

/**
 * 取消收藏游记
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function unfavorite(ctx, next) {
  const {
    curUser: { user_id },
    travel: { travel_id },
  } = ctx.paramData;
  await TravelModel.unfavorite(travel_id, user_id);
  return ctx.setResp('取消收藏游记成功');
}

/**
 * 获取游记评论列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getCommentsList(ctx, next) {
  const { travel_id } = ctx.paramData.travel;
  const comments = await CommentModel.getComments('travel', travel_id);
  return ctx.setResp('获取评论列表成功', comments);
}

/**
 * 发表某游记的评论
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function comment(ctx, next) {
  const {
    curUser: { user_id },
    travel: { travel_id },
    body,
  } = ctx.paramData;
  const props = { user_id, ...body };
  await CommentModel.comment('travel', travel_id, props);
  return ctx.setResp('评论成功');
}
