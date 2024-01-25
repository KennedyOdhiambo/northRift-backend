import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
   customerName: {
      type: String,
      required: [true, 'Customer name must be provided'],
   },

   phoneNumber: {
      type: String,
      required: [true, 'Phone number must be provided'],
   },
});

export const Customer = mongoose.model('Customer', customerSchema);
