import dotenv from 'dotenv';
import { Consts } from '../lib/const';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();

export type AuthenticatedRequest = Request & {
   user?: { id: string };
};

export const logIn = async (req: Request, res: Response) => {
   try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) throw new Error('Phone number and password are required');

      const user = await User.findOne({ phoneNumber, status: 'active' }).select('+password');
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

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   try {
      const token = req.headers.authorization;

      if (!token) throw new Error('No token provided,authorization denied');

      const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
      req.user = { id: (decoded as any).userId };

      next();
   } catch (error) {
      if (error instanceof Error) {
         return res.status(401).json({
            status: Consts.resCodeFail,
            message: error.message,
         });
      }
      return error;
   }
};
