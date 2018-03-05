import * as NotiServ from './service';
import * as NotiModel from './model';

/**
 * 获取通知列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getNotificationsList(ctx, next) {
  const { user_id } = ctx.paramData.curUser;
  const notifications = await NotiModel.findList(user_id);
  await new NotiServ.Polulator().polulate(notifications);
  return ctx.setResp('获取通知列表成功', notifications);
}

/**
 * 更改通知状态
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function update(ctx, next) {
  const { notification_id, is_read } = ctx.paramData.body;
  await NotiModel.changeState(notification_id, is_read);
  return ctx.setResp('修改通知状态成功');
}
