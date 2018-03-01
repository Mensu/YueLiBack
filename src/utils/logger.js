import moment from 'moment';
import { getIp, isInDev } from '.';

const logger = console;
export default logger;

/**
 * 记录请求
 * @param {Context}             ctx
 * @param {{(): Promise<any>}}  next
 */
export async function logRequest(ctx, next) {
  const start = process.hrtime();
  await next();
  const elapsed = process.hrtime(start);
  const interval = `${(elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3)} ms`;

  const {
    body: { msg = '', status = '' } = {},
    paramData: {
      ip = getIp(ctx),
      curUser = { user_id: '000', username: '未登录' },
      extraMsg = '',
    } = {},
    status: statusNum,
    method,
    originalUrl,
  } = ctx;

  const user = curUser;
  const timeText = (isInDev && now()) || '';
  const ipText = String(ip).padEnd(15, ' ');
  const userIdText = String(user.user_id).padEnd(5, ' ');
  const usernameText = String(user.username).padEnd(3, ' ');
  const statusText = (status && ` ${status}`) || '';
  const msgText = (msg && ` - ${msg}`) || '';
  const extraMsgText = (extraMsg && ` - ${extraMsg}`) || '';

  let func = 'info';
  if (statusNum >= 400 && statusNum < 500) {
    func = 'warn';
  } else if (statusNum >= 500) {
    func = 'error';
  }
  logger[func](`${timeText}${ipText} - ${userIdText}\t${usernameText}\t- ${method} ${decodeURIComponent(originalUrl)} - ${interval} - ${statusNum}${statusText}${msgText}${extraMsgText}`);
}

function now() {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS ');
}
