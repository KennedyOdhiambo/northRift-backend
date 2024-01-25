import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { init } from './webApiHandler';

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT;
const DB = process.env.DATABASE_LOCAL;

const app = express();
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});

mongoose
   .connect(DB as string, {})
   .then(() => {
      console.log('DB connected succesfully');
   })
   .catch((error) => {
      console.log(error);
   });

init(app);
