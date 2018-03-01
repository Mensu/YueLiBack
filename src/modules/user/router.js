import Router from 'koa-express-router';
import { exportRtr, isPositiveInt } from '../../utils';
import multer from '../../utils/multer';
import { toMid } from '../../utils/toMid';
import * as UserCtrl from './controller';
import * as UserServ from './service';

const upload = multer();

const userRtr = new Router();
export default exportRtr(userRtr);

userRtr.post('/', UserCtrl.register);
userRtr.post('/login', UserCtrl.login);

userRtr.param('user_id', UserCtrl.parseUserId);

const idRtr = new Router();
userRtr.use(`/:user_id${isPositiveInt}`, exportRtr(idRtr));

idRtr.get('/', { photo: 'avatar' }, UserCtrl.getUserFile);
idRtr.use(toMid(UserServ.require.isLoggedIn));
idRtr.route('/')
  .get({ photo: 'bg' }, UserCtrl.getUserFile)
  .get(UserCtrl.getUserInfo)
  .patch(
    toMid(UserServ.require.isCurUser),
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'bg', maxCount: 1 }]),
    UserCtrl.updateUser,
  );
idRtr.route('/followers')
  .get(UserCtrl.getFollowers)
  .post(UserCtrl.follow)
  .delete(UserCtrl.unfollow);

userRtr.use(toMid(UserServ.require.isLoggedIn));
userRtr.get('/login', UserCtrl.checkIsLoggedIn);
userRtr.post('/logout', UserCtrl.logout);
