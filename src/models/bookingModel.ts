import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
   carNumber: {
      type: String,
      required: [true, 'Car Number must be specified'],
   },

   customer: {
      customerName: {
         type: String,
         required: true,
      },
      customerId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
   },

   bookingDate: {
      type: Date,
      default: Date.now,
   },

   tripDate: {
      type: Date,
      required: true,
   },

   seatNumber: {
      type: Number,
      required: true,
   },

   status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
   },

   paymentMethod: {
      type: String,
      required: true,
   },

   totalPrice: {
      type: Number,
      required: true,
   },
});

export const Booking = mongoose.model('Booking', bookingSchema);
