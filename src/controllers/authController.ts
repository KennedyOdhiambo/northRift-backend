import dotenv from 'dotenv';
import { Consts } from '../lib/const';
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();

export const logIn = async (req: Request, res: Response) => {
   try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) throw new Error('Phone number and password are required');

      const user = await User.findOne({ phoneNumber, status: 'active' });
      if (!user) throw new Error('Invalid phoneNumber');

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Authentication failed,Invalid password');

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as Secret, {
         expiresIn: '1h',
      });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         data: {
            user: user,
            token: token,
         },
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
