import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';

export const bookingRouter = Router();

bookingRouter
   .post('/create', bookingController.createBooking)
   .get('/userBooking', bookingController.getUserBooking)
   .get('/allBookings', bookingController.getAllBookings)
   .patch('/cancel/:id', bookingController.cancelBooking)
   .patch('/confirm/:id', bookingController.confirmBooking);
