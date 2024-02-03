import { Router } from 'express';
import * as shuttleController from '../controllers/shuttleController';

export const shuttleRouter = Router();

shuttleRouter
   .post('/add', shuttleController.addShuttle)
   .patch('/update/:id', shuttleController.updateShuttle)
   .delete('/delete/:id', shuttleController.deleteShuttle)
   .get('/list', shuttleController.listShuttles);
