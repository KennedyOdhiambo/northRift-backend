import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
   MerchantRequestID: String,
   CheckoutRequestID: String,
   ResultCode: Number,
   ResultDesc: String,
   Amount: Number,
   MpesaReceiptNumber: String,
   Balance: Number,
   TransactionDate: Date,
   PhoneNumber: Number,
});

export const Payment = mongoose.model('Payment', paymentSchema);
