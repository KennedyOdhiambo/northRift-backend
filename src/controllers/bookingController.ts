import { Consts } from '../lib/const';
import handleError from '../lib/handleError';
import { Booking } from '../models/bookingModel';
import { User } from '../models/userModel';
import { AuthenticatedRequest } from './authController';
import { Response, Request } from 'express';

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
   try {
      const { carNumber, tripDate, seatNumber, paymentMethod, totalPrice } = req.body;

      if (!carNumber) throw new Error('Shuttle details are required');
      if (!tripDate) throw new Error('Trip date should be specified');
      if (!seatNumber) throw new Error('Please select a seat number');
      if (!paymentMethod) throw new Error('Payment method should be specified');

      const userId = req.user?.id;
      const user = await User.findById(userId);
      if (!user) throw new Error('User must be logged In');

      const customerName = user.fullName;
      const customer = { customerName, customerId: userId };

      const booking = new Booking({
         carNumber,
         tripDate,
         seatNumber,
         paymentMethod,
         totalPrice,
         customer,
      });

      const savedBooking = await booking.save();

      if (!savedBooking) throw new Error('Booking not saved, try again!');

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Booking succesfully recorded',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const getUserBooking = async (req: AuthenticatedRequest, res: Response) => {
   try {
      const customerId = req.user?.id;
      const customerBooking = await Booking.find({ 'customer.customerId': customerId });

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         customerBooking: customerBooking,
      });
   } catch (err) {
      return handleError(err, res);
   }
};

export const getAllBookings = async (req: Request, res: Response) => {
   try {
      const { customerId, status, date } = req.query;

      const query: { 'customer.customerId'?: string; status?: string; tripDate?: Date } = {};

      if (customerId) {
         query['customer.customerId'] = customerId as string;
      }

      if (status) {
         query['status'] = status as string;
      }

      if (date) {
         query['tripDate'] = new Date(date as string);
      }

      const bookings = await Booking.find(query);

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         bookings: bookings,
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const confirmBooking = async (req: Request, res: Response) => {
   try {
      const bookingId = req.params.id;

      const booking = await Booking.findById(bookingId);
      if (!booking) throw new Error('Booking not found');
      if (booking.status === 'cancelled') throw new Error('Cannot confirm cancelled booking!');
      if (booking.status === 'confirmed') throw new Error('Booking already confirmed');

      booking.status = 'confirmed';
      await booking.save();

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Booking succesfully confirmed',
      });
   } catch (error) {
      return handleError(error, res);
   }
};

export const cancelBooking = async (req: Request, res: Response) => {
   try {
      const bookingId = req.params.id;

      const booking = await Booking.findById(bookingId);
      if (!booking) throw new Error('Booking not found');
      if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

      booking.status = 'cancelled';
      await booking.save();

      return res.status(200).json({
         status: Consts.resCodeSuccess,
         message: 'Booking succesfully cancelled',
      });
   } catch (error) {
      return handleError(error, res);
   }
};
