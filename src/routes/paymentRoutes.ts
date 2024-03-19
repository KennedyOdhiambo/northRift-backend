import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';

export const paymentRouter = Router();

paymentRouter.post('/stkPush', paymentController.createToken, paymentController.postStk);
paymentRouter.post('/callback', paymentController.callBack);
