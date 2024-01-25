import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { json, Router, Express, Request, Response, NextFunction } from 'express';
import { Consts } from './lib/const';

dotenv.config({ path: './config.env' });
const URL_PREFIX = process.env.URL_PREFIX || '';

const router = Router();

export const init = (app: Express) => {
   app.use(json());
   app.use(bodyParser.json());
   app.use(cors());

   app.use(URL_PREFIX, router);

   router.get('/', (req, res) => {
      res.status(404).json({
         code: Consts.resCodeFail,
         title: 'Not Found!',
         message: 'The resource you are looking for cannot be found',
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
