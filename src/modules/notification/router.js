import Router from 'koa-express-router';
import { exportRtr } from '../../utils';
import { toMid } from '../../utils/toMid';
import * as NotiCtrl from './controller';
import * as UserServ from '../user/service';

const spotRtr = new Router();
export default exportRtr(spotRtr);

spotRtr.use(toMid(UserServ.require.isLoggedIn));

spotRtr.route('/')
  .get(NotiCtrl.getNotificationsList)
  .patch(NotiCtrl.update);
