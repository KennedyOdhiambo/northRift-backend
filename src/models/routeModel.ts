import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
   from: {
      type: String,
      required: [true],
   },

   destination: {
      type: String,
      required: [true, 'Destination must be provided'],
   },

   fareprice: {
      type: Number,
   },
});

export const Route = mongoose.model('Route', routeSchema);
