import * as mongoose from 'mongoose';

export interface UserJWTToken {
  token: string;
}

export interface AuthenticationFailure {
  errorMessage: string;
}

export interface UserDBCreds {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  passwordHash: string;
}
