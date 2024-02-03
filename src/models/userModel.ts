import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

   status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
   },

   role: {
      type: String,
      enum: ['customer', 'admin'],
      required: [true],
      default: 'customer',
   },
});

userSchema.pre('save', async function (next) {
   if (this.isModified('password')) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
   }
   next();
});

export const User = mongoose.model('User', userSchema);
