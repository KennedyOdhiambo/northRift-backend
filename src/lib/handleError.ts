import logger from '../logger';
import { Consts } from './const';
import { Response } from 'express';

export default function handleError(error: any, res: Response) {
   if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
      logger.error(`Stack: ${error.stack}`);

      return res.status(400).json({
         status: Consts.resCodeFail,
         message: error.message,
      });
   } else {
      logger.error(error);
      return res.status(500).json({
         status: Consts.resCodeFail,
         message: 'An error occurred, Please try again later',
      });
   }
}
