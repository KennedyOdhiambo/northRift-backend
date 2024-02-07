import { Response, Request } from 'express';
import handleError from '../lib/handleError';
import { Path } from '../models/pathModel';
import { Consts } from '../lib/const';

export const addPath = async (req: Request, res: Response) => {
   try {
      const { from, destination, farePrice } = req.body;

      if (!from || !destination || !farePrice)
         throw new Error('Destination and fare price is required');

      const newPath = new Path({ from, destination, farePrice });

      const savedPath = await newPath.save();
      if (!savedPath) throw new Error('Path not saved, try again!');

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Path succesfully added',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const updatePath = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;
      const { from, destination, farePrice } = req.body;

      const updatedData: { from?: string; destination?: string; farePrice?: string } = {};

      if (from) updatedData.from = from;
      if (destination) updatedData.destination = destination;
      if (farePrice) updatedData.farePrice = farePrice;

      const updatedPath = await Path.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedPath) throw new Error('No path found with the specified ID');

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Path succesfully updated',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const listPaths = async (req: Request, res: Response) => {
   try {
      const paths = await Path.find({ isActive: true });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         paths,
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const deletePath = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;

      const path = await Path.findById(id);
      if (!path?.isActive) throw new Error('No path found with specified ID');

      const deletedPath = await Path.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!deletedPath) throw new Error('No path found with the specified ID');

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Path succesfully deleted',
      });
   } catch (error) {
      return handleError(error, res);
   }
};
