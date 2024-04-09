import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
   merchantRequestId: String,
   checkoutRequestId: String,
   responseCode: Number,
   responseDescription: String,
   customerMessage: String,
   amount: Number,
   customerPhoneNumber: String,
   customerName: String,
   shuttleNumber: String,
   bookingDate: String,
});

export const Payment = mongoose.model('Payment', paymentSchema);
