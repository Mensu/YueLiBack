import Router from 'koa-express-router';
import { exportRtr, isPositiveInt } from '../../utils';
import multer from '../../utils/multer';
import { toMid } from '../../utils/toMid';
import * as FeelingCtrl from './controller';
import * as UserServ from '../user/service';
import * as FeelingServ from './service';

const upload = multer();

const feelingRtr = new Router();
export default exportRtr(feelingRtr);

feelingRtr.use(toMid(UserServ.require.isLoggedIn));

feelingRtr.route('/')
  .get(FeelingCtrl.getFeelingsList)
  .post(
    upload.single('photo'),
    FeelingCtrl.create,
  );

feelingRtr.param('feeling_id', FeelingCtrl.parseFeelingId);

const idRtr = new Router();
feelingRtr.use(`/:feeling_id${isPositiveInt}`, exportRtr(idRtr));

idRtr.route('/')
  .get({ photo: 'photo' }, FeelingCtrl.getFeelingPhoto)
  .all(toMid(FeelingServ.require.authorIsCurUser))
  .delete(
    FeelingCtrl.del,
  );

idRtr.route('/comments')
  .get(FeelingCtrl.getCommentsList)
  .post(FeelingCtrl.comment);
