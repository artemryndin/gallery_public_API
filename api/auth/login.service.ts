import { getEnv } from '@helper/environment';
import { connectDB } from '@services/db_connection';
import * as jwt from 'jsonwebtoken';
import { SignUpResponse } from './login.interface';
import { UsersModel } from '@models/MongoDB/user.model';

export class LoginService {
  signJWTToken(userEmail: string) {
    return jwt.sign({ email: userEmail }, getEnv('TOKEN_KEY'));
  }

  async signUp(userEmail: string, hashedPassword: string): Promise<SignUpResponse> {
    await connectDB;
    if (await UsersModel.exists({ email: userEmail })) {
      return {
        statusCode: 400,
        message: { errorMessage: 'User already exists' },
      };
    } else {
      await UsersModel.create({ email: userEmail, passwordHash: hashedPassword });
      return {
        statusCode: 200,
        message: { message: 'Signed up' },
      };
    }
  }
}
