import mongoose from 'mongoose';

const shuttleSchema = new mongoose.Schema({
   numberPlate: {
      type: String,
      required: [true, 'Shuttle number must be provided'],
   },

   driver: {
      type: String,
      required: [true, 'Driver details must be provided'],
   },

   status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
   },
});

export const Shuttle = mongoose.model('Shuttle', shuttleSchema);
