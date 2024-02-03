import { Router } from 'express';
import * as userController from '../controllers/userController';

export const userRouter = Router();

userRouter
   .post('/create', userController.createUser)
   .get('/list', userController.listUsers)
   .delete('/delete/:userId', userController.deleteUser)
   .patch('/update/:userId', userController.updateUser);
