import * as crypto from 'crypto';

import { connectDB } from '@services/db_connection';
import { UsersModel } from '@models/MongoDB/user.model';
import { UserJWTToken } from './login.interface';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { LoginService } from './login.service';
import { getEnv } from '@helper/environment';
import { UserDBCreds } from './login.interface';
import { HttpBadRequestError } from '@errors/http';

export class LoginManager {
  private readonly service: LoginService;

  constructor() {
    this.service = new LoginService();
  }

  async checkUserAndSignJWT(user: UserCredentials): Promise<UserJWTToken | HttpBadRequestError> {
    await connectDB;
    let usersHashedPass = crypto.createHmac('sha256', getEnv('PASSWORD_ENC_KEY')).update(user.password).digest('hex');
    let userDB: UserDBCreds = await UsersModel.findOne({ email: user.email });
    console.log(`userDB: ${userDB}`);
    if (userDB.passwordHash === usersHashedPass) {
      return this.service.signJWTToken(user.email);
    } else {
      throw new HttpBadRequestError('User not found');
    }
  }
}
