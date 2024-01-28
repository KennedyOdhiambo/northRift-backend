import { Request, Response } from 'express';
import { Consts } from '../lib/const';
import { User } from '../models/userModel';

export const createUser = async (req: Request, res: Response) => {
   try {
      await User.create(req.body);

      return res.status(201).json({
         status: Consts.resCodeSuccess,
         message: 'User account succesfully created',
      });
   } catch (error: any) {
      console.error(error);
      return res.status(500).json({
         status: Consts.resCodeFail,
         message: 'Something went wrong',
      });
   }
};

export const listUsers = async (req: Request, res: Response) => {
   try {
      const users = await User.find();

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         data: users,
      });
   } catch (error: any) {
      console.error(error);
      return res.status(500).json({
         status: Consts.resCodeFail,
         message: 'Failed to list users',
      });
   }
};
