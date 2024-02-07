import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
   level: 'info',
   format: winston.format.json(),
   transports: [
      new winston.transports.File({
         filename: 'error.log',
         level: 'error',
         format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
      new winston.transports.File({
         filename: 'combined.log',
         format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
   ],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new winston.transports.Console({
         format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      })
   );
}

export default logger;
