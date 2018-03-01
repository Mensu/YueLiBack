import { port } from './config';
import app from './app';
import logger from './utils/logger';

app.listen(port, () => {
  logger.info(`悦历服务端 ${process.env.NODE_ENV} 启动, 监听端口 ${port}`);
});
