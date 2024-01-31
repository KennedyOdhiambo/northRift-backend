import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/userController';

export const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.get('/list', listUsers);
userRouter.delete('/delete/:userId', deleteUser);
userRouter.patch('/update/:userId', updateUser);
