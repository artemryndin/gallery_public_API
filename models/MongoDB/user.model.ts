import { config } from 'dotenv';
config();
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },
});

const UsersModel = mongoose.models.Test_users || mongoose.model('Test_users', UserSchema);
export { UsersModel };
