import Router from 'koa-express-router';
import dev from './dev';
// import test from './test';
// import production from './production';

// 环境变量设置
const { NODE_ENV = 'dev' } = process.env;
Object.assign(process.env, { NODE_ENV });

// 路由器默认设置
Router.defaultOptions.mergeParams = true;

// 配置
const config = getConfig();
export default config;
export const appKeys = config.appKeys;
export const port = config.port;
export const db = config.db;
export const salt = config.salt;
export const MockService = config.MockService;
export const FileService = config.FileService;

/** @return {typeof dev} */
function getConfig() {
  const map = { [NODE_ENV]: dev, dev };
  return map[NODE_ENV];
}
