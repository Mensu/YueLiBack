import * as FavModel from './model';

/**
 * 获取收藏列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getFavList(ctx, next) {
  const { user_id } = ctx.paramData.curUser;
  const favs = await FavModel.findList(user_id);
  return ctx.setResp('获取收藏列表成功', favs);
}
