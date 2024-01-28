import { Router } from 'express';
import { createUser, listUsers } from '../controllers/userController';

export const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.get('/list', listUsers);
