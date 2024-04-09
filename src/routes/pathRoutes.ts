import { Router } from 'express';
import * as pathController from '../controllers/pathController';
import { protect } from '../controllers/authController';

export const pathRouter = Router();

pathRouter
   .post('/create', protect, pathController.addPath)
   .patch('/update/:id', protect, pathController.updatePath)
   .get('/list', pathController.listPaths)
   .delete('/delete/:id', protect, pathController.deletePath)
   .get('/findByShuttleId/:shuttleId', pathController.findByShuttleId);
