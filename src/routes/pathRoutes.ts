import { Router } from 'express';
import * as pathController from '../controllers/pathController';

export const pathRouter = Router();

pathRouter
   .post('/create', pathController.addPath)
   .patch('/update/:id', pathController.updatePath)
   .get('/list', pathController.listPaths)
   .delete('/delete/:id', pathController.deletePath);
