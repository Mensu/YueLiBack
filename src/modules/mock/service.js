import request from 'request-promise-native';
import { MockService } from '../../config';
import { pick } from '../../utils';

/**
 * 代理至 mock server
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function mockAPI(ctx, next) {
  const { method } = ctx;
  const uri = `${MockService.url}${decodeURIComponent(ctx.URL.pathname)}`;
  const headers = pick(ctx.header, 'prefer');
  const options = {
    json: true,
    resolveWithFullResponse: true,
    simple: false,
  };
  const response = await request({ uri, method, headers, ...options });
  if (response.headers['content-type'] !== 'application/json') {
    return next();
  }
  ctx.status = response.statusCode;
  ctx.body = response.body;
}
