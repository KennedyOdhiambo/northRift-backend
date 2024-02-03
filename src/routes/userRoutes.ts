import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';

export const userRouter = Router();

userRouter
   .post('/create', userController.createUser)
   .get('/logIn', authController.logIn)
   .get('/list', userController.listUsers)
   .delete('/delete/:userId', userController.deleteUser)
   .patch('/update/:userId', userController.updateUser);
