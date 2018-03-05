import util from 'util';
import { isInProd, assign } from './utils';
import * as AE from './AE';
import logger from './logger';

export { AE };
export const isPositiveInt = '([1-9][0-9]{0,})';
export * from './utils';

/**
 * 处理服务器或用户异常
 * @param  {Context}    ctx
 * @param  {INext}      next
 */
export async function handleException(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.paramData = ctx.paramData || {};
    if (e instanceof AE.SoftError) return handleSoftError(ctx, e);
    return ctx.handleError(e);
  }
}

/**
 * @param {Error & { was?: string }} e
 */
function getExtraMsg(e) {
  if (e.was === 'error') {
    return util.inspect(e, { depth: null });
  } else if (e.was && e.was !== 'undefined') {
    return e.message;
  }
  return undefined;
}

// for typing
const { SoftError } = AE;

/**
 * @param {Context} ctx
 * @param {SoftError} e
 */
async function handleSoftError(ctx, e) {
  const { status, msg, data = {} } = e.info;
  const extraMsg = getExtraMsg(e);
  return ctx.setResp(msg, data, extraMsg, status);
}

/**
 * @param  {string}   [msg]
 * @param  {any}      [data]
 * @param  {string}   [extraMsg]
 * @param  {string}   [status]
 */
export async function setResp(msg = 'OK', data = {}, extraMsg = undefined, status = 'OK') {
  /** @type {Context} */
  const ctx = this;
  if (extraMsg) assign(ctx.paramData, { extraMsg });
  ctx.status = AE.AppError.getCode(status);
  ctx.body = { data, msg };
}

/**
 * @param  {Error & { info?: { status: string, msg: string, data?: any } }} e
 */
export async function handleError(e) {
  logger.error(e);

  /** @type {Context} */
  const ctx = this;
  const { status = AE.UNKNOWN_ERROR, msg = '未知错误', data = {} } = e.info || {};

  const extraMsg = getExtraMsg(e);
  if (extraMsg) assign(ctx.paramData, { extraMsg });

  ctx.status = AE.AppError.getCode(status);
  ctx.body = { data, msg };

  const { stack } = e;
  if (!isInProd) assign(ctx.body, { stack });
}

/**
 *
 * @param {KoaExpressRouter} router
 */
export function exportRtr(router) {
  return router.routes();
}

/**
 * 不等待中间件执行完成，只触发中间件的执行，从而可以在中间件执行的过程中响应
 *
 * 适用场景例如：通知的中间件。主要请求已经完成后，通知可以去后台做，没必要等通知插完数据库完毕后再响应，延长用户等待时间
 * @param  {IMiddleware}  mid  中间件
 * @return  {IMiddleware}
 */
export function detach(mid) {
  return async (ctx, next) => {
    try {
      const ret = mid(ctx, () => Promise.resolve());
      if (ret.catch) ret.catch(e => logger.error(e));
    } catch (e) {
      logger.error(e);
    }
    return next();
  };
}
