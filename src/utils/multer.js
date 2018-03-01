import koaMulter from 'koa-multer';
import { AE, pick, assign } from '.';

/**
 *
 * @param {MulterOptions} options
 */
export default function multer(options = {}) {
  const defaultOpt = {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fileSize: 10 * 1024 * 1024, // 10 Mib
      fields: 5,
      files: 5,
      parts: 10,
    },
  };
  options = assign({}, defaultOpt, options);
  /**
   * @type {MulterInstance}
   */
  // @ts-ignore
  const upload = koaMulter(options);
  const funcs = ['any', 'array', 'fields', 'none', 'single'];
  funcs.forEach(oneFunc => wrapErrHandler(upload, oneFunc));
  return upload;
}

function wrapErrHandler(upload, oneFunc) {
  const uploadFunc = upload[oneFunc];
  upload[oneFunc] = (...args) => async (ctx, next) => {
    try {
      await uploadFunc.call(upload, ...args)(ctx, () => {});
    } catch (e) {
      throw new AE.SoftError(AE.BAD_REQUEST, e.message, e);
    }
    const files = pick(ctx.req, 'file', 'files');
    const body = pick(ctx.req, 'body');
    assign(ctx, files);
    assign(ctx.request, files, body);
    assign(ctx.paramData, files, body);
    return next();
  };
}
