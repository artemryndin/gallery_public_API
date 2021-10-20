import { config } from 'dotenv';
config();
import * as mongoose from 'mongoose';

async function connectDB() {
  console.log('Connecting database . . .');
  if (process.env.MONGODB_URI) {
    return await mongoose.connect(process.env.MONGODB_URI);
  } else {
    throw new Error('mongodb URI is not defined');
  }
}

export { connectDB };
