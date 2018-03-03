import * as TRServ from './service';
import * as TRModel from './model';
import { assign } from '../../utils';

const { TravelRecordFile } = TRServ;

/**
 * 获取游记记录列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getRecordsList(ctx, next) {
  const { records } = ctx.paramData.travel;
  return ctx.setResp('获取游记记录列表成功', records);
}

/**
 * 创建新的游记记录
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function create(ctx, next) {
  const { travel: { travel_id }, file, body } = ctx.paramData;
  await TRModel.create({ travel_id, ...body });
  const uploader = new TravelRecordFile(travel_id);
  await uploader.upload(file.buffer);
  return ctx.setResp('发表游记记录成功', { travel_id });
}

/**
 * 解析 travel_record_id
 * @param {Context} ctx
 * @param {INext}   next
 * @param {string}  id
 */
export async function parseTravelId(ctx, next, id) {
  const travel_record_id = Number(id);
  const travel_record = await TRServ.retrieveTravelRecord(travel_record_id);
  assign(ctx.paramData, { travel_record });
  return next();
}

/**
 * 获取游记记录图片
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getTravelRecordPhoto(ctx, next) {
  const { travel_record_id } = ctx.paramData.travel_record;
  const downloader = new TravelRecordFile(travel_record_id);
  ctx.body = await downloader.download();
  ctx.body.msg = '获取游记记录图片';
}

/**
 * 修改一次游记记录
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function update(ctx, next) {
  const { travel_record: { travel_record_id }, file, body } = ctx.paramData;

  /** @type {Promise[]} */
  const tasks = [];
  if (file) {
    const uploader = new TravelRecordFile(travel_record_id);
    tasks.push(uploader.upload(file.buffer));
  }
  if (Object.keys(body).length > 0) {
    tasks.push(TRModel.update(travel_record_id, { ...body }));
  }
  await Promise.all(tasks);
  return ctx.setResp('修改游记记录成功');
}

/**
 * 删除一次游记记录
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function del(ctx, next) {
  const { travel_record_id } = ctx.paramData.travel_record;
  await TRModel.del(travel_record_id);
  return ctx.setResp('删除游记记录成功');
}
