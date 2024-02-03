import cors from 'cors';
import dotenv from 'dotenv';
import { json, Router, Express, Request, Response, NextFunction } from 'express';
import { Consts } from './lib/const';
import { protect } from './controllers/authController';
import { userRouter } from './routes/userRoutes';
import { shuttleRouter } from './routes/shuttleRoutes';

dotenv.config({ path: './config.env' });
const URL_PREFIX = process.env.URL_PREFIX || '';

const router = Router();

export const init = (app: Express) => {
   app.use(json());
   app.use(cors());

   router.use('/users', userRouter);
   router.use('/shuttle', protect, shuttleRouter);

   app.use(URL_PREFIX, router);

   app.all('*', (req, res, next) => {
      res.status(404).json({
         status: Consts.resCodeFail,
         message: `Cant find ${req.originalUrl} on the server`,
      });
   });

   app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.log('Error 500 ' + err.message);
      res.status(500);

      res.send({
         code: Consts.resCodeFail,
         title: 'Internal Server Error',
         message: 'An error occurred trying to process your request ' + err.message,
      });
      return;
   });
};
