import Router from 'koa-express-router';
import { exportRtr } from '../../utils';
import { toMid } from '../../utils/toMid';
import * as FavCtrl from './controller';
import * as UserServ from '../user/service';

const favRtr = new Router();
export default exportRtr(favRtr);

favRtr.use(toMid(UserServ.require.isLoggedIn));

favRtr.get('/', FavCtrl.getFavList);
