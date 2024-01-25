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
});

export const Shuttle = mongoose.model('Shuttle', shuttleSchema);
