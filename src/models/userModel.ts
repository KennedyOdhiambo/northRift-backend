import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: [true, 'Customer name must be provided'],
   },

   phoneNumber: {
      type: String,
      required: [true, 'Phone number must be provided'],
      unique: ['true', 'Phone number already exists'],
   },

   password: {
      type: String,
      required: [true, 'User must have a password'],
   },
});

export const User = mongoose.model('User', userSchema);
