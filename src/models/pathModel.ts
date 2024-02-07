import mongoose from 'mongoose';

const pathSchema = new mongoose.Schema({
   from: {
      type: String,
      required: [true],
   },

   destination: {
      type: String,
      required: [true, 'Destination must be provided'],
   },

   farePrice: {
      type: Number,
      required: true,
   },

   isActive: {
      type: Boolean,
      default: true,
   },
});

export const Path = mongoose.model('Path', pathSchema);
