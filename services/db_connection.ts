import { log } from '@helper/logger';
import { resolve } from 'bluebird';
import * as mongoose from 'mongoose';
import { getEnv } from '../helper/environment';

mongoose.connect(getEnv('MONGODB_URI'));

// async function connectDB() {
// console.log('Connecting database . . .');
// if (getEnv("MONGODB_URI")) {
//   return await mongoose.connect(getEnv("MONGODB_URI"));
// } else {
//   throw new Error('mongodb URI is not defined');
// }
// }

export const connectDB = new Promise((res, rej) => {
  mongoose.connection.on('error', (error) => {
    log(error);
    rej(error);
  });

  mongoose.connection.on('open', () => {
    log('DB connected');
  });

  res(mongoose.connection);
});
