import { Response, Request } from 'express';
import handleError from '../lib/handleError';
import { Path } from '../models/pathModel';
import { Consts } from '../lib/const';
import { Shuttle } from '../models/shuttleModel';

export const addPath = async (req: Request, res: Response) => {
   try {
      console.log(req.body);
      const { from, destination, farePrice, travelDate, shuttleId } = req.body;

      if (!from || !destination || !farePrice || !travelDate || !shuttleId) {
         throw new Error(
            'All fields are required: from, destination, farePrice, travelDate,shuttleId'
         );
      }

      const shuttle = await Shuttle.findById(shuttleId);
      if (!shuttle) throw new Error('Shuttle not found');

      const newPath = new Path({
         from,
         destination,
         farePrice,
         travelDate,

         shuttle: shuttle._id,
      });

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

export const findByShuttleId = async (req: Request, res: Response) => {
   try {
      const { shuttleId } = req.params;

      const paths = await Path.find({ shuttle: shuttleId });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         paths: paths,
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const updatePath = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;
      const { from, destination, farePrice, travelDate, departureTime } = req.body;

      const updatedData: {
         from?: string;
         destination?: string;
         farePrice?: string;
         travelDate?: string;
         departureTime?: string;
      } = {};

      if (from) updatedData.from = from;
      if (destination) updatedData.destination = destination;
      if (farePrice) updatedData.farePrice = farePrice;
      if (travelDate) updatedData.travelDate = travelDate;
      if (departureTime) updatedData.departureTime = departureTime;

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
      const query: any = {};

      if (req.query.from) {
         query['from'] = req.query.from.toString();
      }

      if (req.query.destination) {
         query['destination'] = req.query.destination.toString();
      }

      if (req.query.travelDate) {
         query.travelDate = {
            $gte: new Date(req.query.travelDate as string),
            $lt: new Date((req.query.travelDate as string) + 'T23:59:59Z'),
         };
      }

      const paths = await Path.find(query);

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

      await Path.findById(id);

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
