import Router from 'koa-express-router';
import { exportRtr, isPositiveInt } from '../../utils';
import multer from '../../utils/multer';
import { toMid } from '../../utils/toMid';
import * as TRCtrl from './controller';
import * as UserServ from '../user/service';
import * as TRServ from './service';

const upload = multer();

const trRtr = new Router();
export default exportRtr(trRtr);

trRtr.use(toMid(UserServ.require.isLoggedIn));

trRtr.param('travel_record_id', TRCtrl.parseTravelId);

const idRtr = new Router();
trRtr.use(`/:travel_record_id${isPositiveInt}`, exportRtr(idRtr));

idRtr.route('/')
  .get({ photo: 'photo' }, TRCtrl.getTravelRecordPhoto)
  .all(toMid(TRServ.require.authorIsCurUser))
  .patch(
    upload.single('photo'),
    toMid(TRServ.validate.spot_id),
    TRCtrl.update,
  )
  .delete(TRCtrl.del);
