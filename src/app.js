import Koa from 'koa';
import { appKeys } from './config';
import { setResp, handleError, handleException } from './utils';
import { logRequest } from './utils/logger';
import route from './router';

const app = new Koa();
app.keys = appKeys;
app.context.setResp = setResp;
app.context.handleError = handleError;
app.use(logRequest);
app.use(handleException);
app.on('error', (/** @type {Error} */ e, /** @type {Context} */ ctx) => ctx.handleError(e));
route(app);

export default app;
