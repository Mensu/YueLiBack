import crypto from 'crypto';
import util from 'util';
import moment from 'moment';
import _ from 'lodash';

const env = process.env.NODE_ENV;
export const isInDev = env === 'development';
export const isInProd = env === 'production';
export const assign = Object.assign;
export const pick = _.pick;
export const has = _.has;

/**
 * setTimeout 的 Promise 封装
 * @param  {number}    millisecond
 */
export function sleep(millisecond) {
  return new Promise(resolve => setTimeout(resolve, millisecond));
}

/**
 * 格式化日期字符串
 * @param  {Date}      date
 * @author 陈宇翔
 */
export function formatDate(date = new Date()) {
  return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
}
/**
 * 获得请求发送方的 ip
 * @param   {Context}  ctx
 * @author  陈宇翔
 */
export function getIp(ctx) {
  const xRealIp = ctx.get('X-Real-Ip');
  const { ip } = ctx;
  const { remoteAddress } = ctx.req.connection;
  return xRealIp || ip || remoteAddress;
}

/**
 * 若 body 有属性 prop，且该属性为字符串，则对该属性 JSON.parse，并捕捉异常
 * @param  {any}      body           任何对象
 * @param  {string}   prop           属性的键
 * @return                           true 表示没异常，false 表示有异常
 * @author 陈宇翔
 */
export function jsonParseProp(body, prop) {
  /* eslint no-eval: off */
  try {
    if (has(body, prop) && typeof body[prop] === 'string') {
      body[prop] = JSON.parse(body[prop]);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 对 body JSON.parse，并捕捉异常
 * @param  {any}      body      任何对象
 * @return                      undefined 表示有异常
 * @author 陈宇翔
 */
export function jsonParse(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return undefined;
  }
}

/**
 * 对所有函数进行 `util.promisify`
 * @param  {any}       obj
 * @param  {string}    suffix
 * @return {any}
 */
export function promisifyAll(obj, suffix = 'Async') {
  Object.entries(obj).forEach(([key, value]) => {
    const promisifiedKey = `${key}${suffix}`;
    const isNotSimpleFunc = Object.prototype.toString.call(value) !== '[object Function]';
    const hasPromisifiedKey = has(obj, promisifiedKey);
    if (isNotSimpleFunc || hasPromisifiedKey) return;
    obj[promisifiedKey] = util.promisify(value);
  });
  return obj;
}

/**
 *
 * @param {string} data
 */
export function md5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}
