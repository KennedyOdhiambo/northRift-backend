import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
   carNumber: {
      type: Number,
      required: [true, 'Car Number must be specified'],
   },

   customers: {
      customerName: String,
   },
});

export const Booking = mongoose.model('Booking', bookingSchema);
