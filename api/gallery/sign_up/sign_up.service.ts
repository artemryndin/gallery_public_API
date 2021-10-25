import { UserCredentials } from '@interfaces/user-credentials.interface';
import { connectDB } from '@services/db_connection';
import { UsersModel } from '@models/MongoDB/user.model';
import * as crypto from 'crypto';
import { getEnv } from '@helper/environment';
import { SignUpErrorMessage, SignUpMessage, SignUpResponse } from './sign_up.interface';

export class SignUpService {
  errorMessage: SignUpErrorMessage;
  message: SignUpMessage;
  response: SignUpResponse;

  constructor() {
    this.errorMessage = { errorMessage: 'User already exists' };
    this.message = { message: 'Signed up' };
    this.response = {
      statusCode: 200,
      message: this.message,
    };
  }

  async signUp(credentials: UserCredentials): Promise<SignUpResponse> {
    await connectDB;
    if (await UsersModel.exists({ email: credentials.email })) {
      this.response.statusCode = 300;
      this.response.message = this.errorMessage;
      return this.response;
    } else {
      await UsersModel.create({
        email: credentials.email,
        passwordHash: crypto
          .createHmac('sha256', getEnv('PASSWORD_ENC_KEY'))
          .update(credentials.password)
          .digest('hex'),
      });

      this.response.statusCode = 200;
      this.response.message = this.message;
      return this.response;
    }
  }
}
