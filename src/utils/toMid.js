import util from 'util';

/**
 * 将 func 函数变成 router.param 函数的中间件
 * @param  {{(paramData: ParamData, ctx: Context, id: string, name: string): any }} func
 * @return {{(ctx: Context, next: () => Promise<any>, id: string, name: string): Promise<any>}}  中间件
 */
export function toParamMid(func) {
  throwIfNotFunction(func);
  return async (ctx, next, id, name) => {
    await func(ctx.paramData, ctx, id, name);
    return next();
  };
}

/**
 * 将函数变成可以 use 的中间件
 * @param  {{(paramData: ParamData, ctx: Context): any }} func
 * @return {IMiddleware}  中间件
 */
export function toMid(func) {
  throwIfNotFunction(func);
  return async (ctx, next) => {
    await func(ctx.paramData, ctx);
    return next();
  };
}

/**
 *
 * @param {any} func
 */
function throwIfNotFunction(func) {
  if (typeof func === 'function') return;
  throw new TypeError(`传进 toMid 的 ${util.inspect(func, { depth: null })} 不是函数`);
}
