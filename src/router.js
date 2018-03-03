import Router from 'koa-express-router';
import compose from 'koa-compose';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';

import userRtr from './modules/user/router';
import spotRtr from './modules/spot/router';
import travelRtr from './modules/travel/router';
import trRtr from './modules/travel-record/router';
import feelingRtr from './modules/feeling/router';

import * as MockServ from './modules/mock/service';

import { AE, getIp } from './utils';

/**
 * @param {Application} app
 */
export default function route(app) {
  const apiRtr = new Router({ prefix: '/api' });
  app.use(apiRtr.routes(false));

  apiRtr.use(
    getSessionParser(app),
    getBodyParser(),
    initParam,
  );

  // 一级路由
  apiRtr.use('/users', userRtr);
  apiRtr.use('/spots', spotRtr);
  apiRtr.use('/travels', travelRtr);
  apiRtr.use('/travel-records', trRtr);
  apiRtr.use('/feelings', feelingRtr);
  apiRtr.use('/favorites', MockServ.mockAPI);
  apiRtr.use('/notifications', MockServ.mockAPI);

  // 404 guard
  apiRtr.use((ctx, next) => {
    if (ctx.body === undefined) {
      return next();
    }
  });

  app.use((ctx, next) => {
    throw new AE.SoftError(AE.NOT_FOUND, '找不到该路径');
  });
}

function getSessionParser(app) {
  const options = {
    key: 'yueli-session',
    maxAge: 3 * 60 * 60 * 1000,  // 3h
    renew: true,
    renewAfter: 60 * 1000,  // 60s
  };
  return compose([session(options, app), setExpire]);
}

/**
 *
 * @param {Context} ctx
 * @param {INext}   next
 */
async function setExpire(ctx, next) {
  const { session, sessionOptions } = ctx;
  try {
    await next();
  } finally {
    const { maxAge = 0, _expire } = session;
    if (typeof maxAge === 'number') {
      /** @type { typeof sessionOptions & { renewAfter?: number } } */
      const { renewAfter = maxAge } = sessionOptions;
      // now 已经超过 renewAfter 了
      if (Date.now() > _expire - maxAge + renewAfter) {
        session._expire = Date.now() + Math.ceil(maxAge / 5);
      }
    }
  }
}

function getBodyParser() {
  const options = {
    jsonLimit: '10mb',
    textLimit: '10mb',
    /**
     *
     * @param {Error} e
     */
    onerror(e) {
      throw new AE.SoftError(AE.UNPROCESSABLE_ENTITY, '请求解析失败', e);
    },
  };
  return bodyParser(options);
}

/**
 * 初始化 paramData
 * @param {Context} ctx
 * @param {INext}   next
 */
async function initParam(ctx, next) {
  ctx.paramData = {
    body: ctx.request.body,
    query: { ...ctx.request.query },
    session: ctx.session,
    ip: getIp(ctx),
    host: ctx.host,
  };
  return next();
}
