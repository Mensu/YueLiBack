import Router from 'koa-express-router';
import { exportRtr, isPositiveInt } from '../../utils';
import multer from '../../utils/multer';
import { toMid } from '../../utils/toMid';
import * as TravelCtrl from './controller';
import * as TRCtrl from '../travel-record/controller';
import * as UserServ from '../user/service';
import * as TravelServ from './service';
import * as TRServ from '../travel-record/service';

const upload = multer();

const travelRtr = new Router();
export default exportRtr(travelRtr);

travelRtr.use(toMid(UserServ.require.isLoggedIn));

travelRtr.route('/')
  .get(TravelCtrl.getTravelsList)
  .post(
    upload.single('cover'),
    TravelCtrl.create,
  );

travelRtr.param('travel_id', TravelCtrl.parseTravelId);

const idRtr = new Router();
travelRtr.use(`/:travel_id${isPositiveInt}`, exportRtr(idRtr));

idRtr.route('/')
  .get({ photo: 'cover' }, TravelCtrl.getTravelCover)
  .all(toMid(TravelServ.require.authorIsCurUser))
  .patch(
    upload.single('cover'),
    TravelCtrl.update,
  )
  .delete(
    TravelCtrl.del,
  );

idRtr.route('/favorite')
  .post(TravelCtrl.favorite)
  .delete(TravelCtrl.unfavorite);

idRtr.route('/comments')
  .get(TravelCtrl.getCommentsList)
  .post(TravelCtrl.comment);

idRtr.post('/travel-records',
  toMid(TravelServ.require.authorIsCurUser),
  upload.single('photo'),
  toMid(TRServ.validate.spot_id),
  TRCtrl.create,
);
