import Router from 'koa-express-router';
import { exportRtr, isPositiveInt } from '../../utils';
import multer from '../../utils/multer';
import { toMid } from '../../utils/toMid';
import * as SpotCtrl from './controller';
import * as TravelCtrl from '../travel/controller';
import * as UserServ from '../user/service';

const upload = multer();

const spotRtr = new Router();
export default exportRtr(spotRtr);

spotRtr.use(toMid(UserServ.require.isLoggedIn));

spotRtr.get('/', SpotCtrl.getSpotsList);

spotRtr.param('spot_id', SpotCtrl.parseSpotId);

const idRtr = new Router();
spotRtr.use(`/:spot_id${isPositiveInt}`, exportRtr(idRtr));

idRtr.route('/')
  .get({ photo: 'bg' }, SpotCtrl.getSpotBg)
  .get(SpotCtrl.getSpotInfo);

idRtr.route('/favorite')
  .post(SpotCtrl.favorite)
  .delete(SpotCtrl.unfavorite);

idRtr.post('/rank', SpotCtrl.rank);

idRtr.route('/comments')
  .get(SpotCtrl.getCommentsList)
  .post(SpotCtrl.comment);

idRtr.post('/travels',
  upload.single('cover'),
  TravelCtrl.create,
);
