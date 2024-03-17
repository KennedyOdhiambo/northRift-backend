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

   travelDate: {
      type: Date,
      required: true,
   },

   departureTime: {
      type: Date,
      required: true,
   },

   availableSeats: {
      type: Number,
      default: 0,
   },

   shuttle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shuttle',
   },
});

export const Path = mongoose.model('Path', pathSchema);
