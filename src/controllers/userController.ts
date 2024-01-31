import { Request, Response } from 'express';
import { Consts } from '../lib/const';
import { User } from '../models/userModel';

export const createUser = async (req: Request, res: Response) => {
   try {
      const { phoneNumber } = req.body;
      const existingUser = await User.findOne({ phoneNumber });

      if (existingUser) throw new Error('Phone number already exists');

      await User.create(req.body);

      return res.status(201).json({
         status: Consts.resCodeSuccess,
         message: 'User account succesfully created',
      });
   } catch (error: any) {
      console.error(error);
      return res.status(500).json({
         status: Consts.resCodeFail,
         message: error.message,
      });
   }
};

export const listUsers = async (req: Request, res: Response) => {
   try {
      const users = await User.find({ status: 'active' }, { password: 0 });

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

export const updateUser = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      if (!userId) {
         throw new Error('User ID is required');
      }

      const updates = req.body;

      if (!updates || Object.keys(updates).length === 0) {
         throw new Error('No updates provided');
      }

      const result = await User.updateOne({ _id: userId }, { $set: updates });

      if (result.modifiedCount === 0) {
         throw new Error('No user with provided Id exists or no updates were applied');
      }

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'User details successfully updated!',
      });
   } catch (error) {
      if (error instanceof Error) {
         return res.status(500).json({
            status: Consts.resCodeFail,
            message: error.message,
         });
      }
      return error;
   }
};

export const deleteUser = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      if (!userId) {
         throw new Error('User details are required');
      }

      const existingUser = await User.findById(userId);

      if (!existingUser) {
         throw new Error('No user with provided Id exists');
      }

      if (existingUser.status === 'deleted') {
         throw new Error('User account already deleted');
      }

      await User.updateOne({ _id: userId }, { $set: { status: 'deleted' } });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'User deleted successfully',
      });
   } catch (error) {
      if (error instanceof Error) {
         return res.status(500).json({
            status: Consts.resCodeFail,
            message: error.message,
         });
      }
      return error;
   }
};
