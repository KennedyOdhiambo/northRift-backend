import { Request, Response } from 'express';
import { Consts } from '../lib/const';
import { Shuttle } from '../models/shuttleModel';
import handleError from '../lib/handleError';

export const addShuttle = async (req: Request, res: Response) => {
   const { numberPlate, driver } = req.body as { numberPlate: string; driver: string };

   try {
      if (!numberPlate || !driver) {
         throw new Error('Shuttle number and driver details are required');
      }

      const existingShuttle = await Shuttle.findOne({ numberPlate });
      if (existingShuttle) {
         throw new Error('A shuttle with this number plate already exists');
      }

      const shuttle = new Shuttle({ numberPlate, driver });

      await shuttle.save();

      res.status(201).json({
         status: Consts.resCodeSuccess,
         message: 'Shutlle succesfull added',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const updateShuttle = async (req: Request, res: Response) => {
   const { id } = req.params;

   const { numberPlate, driver } = req.body;

   try {
      if (!id) throw new Error('Shuttle id is required');

      const shuttle = await Shuttle.findById(id);
      if (!shuttle) throw new Error('Shuttle not found');

      const updateResult = await Shuttle.updateOne({ _id: id }, { $set: { numberPlate, driver } });
      if (updateResult.modifiedCount === 0) {
         throw new Error('No changes were saved');
      }

      return res.status(200).json({
         status: Consts.resCodeFail,
         message: 'Shuttle succesfully updated',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const deleteShuttle = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      if (!id) throw new Error('Shuttle Id is required');

      const shuttle = await Shuttle.findById(id);
      console.log(shuttle);
      if (!shuttle) throw new Error('Shuttle not found');
      if (shuttle.status === 'deleted') throw new Error('Shuttle already deleted');

      shuttle.status = 'deleted';
      await shuttle.save();

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Shuttle succesfully deleted',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const listShuttles = async (req: Request, res: Response) => {
   try {
      const shuttles = await Shuttle.find({ status: 'active' });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         data: shuttles,
      });
   } catch (error) {
      return handleError(error, res);
   }
};
