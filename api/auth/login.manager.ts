import * as crypto from 'crypto';

import { connectDB } from '@services/db_connection';
import { UsersModel } from '@models/MongoDB/user.model';
import { AuthenticationResponse, SignUpResponse } from './login.interface';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { LoginService } from './login.service';
import { getEnv } from '@helper/environment';
import { UserDBCreds } from './login.interface';

export class LoginManager {
  private readonly service: LoginService;
  constructor() {
    this.service = new LoginService();
  }

  encryptUsersPassword(pw: string): string {
    return crypto.createHmac('sha256', getEnv('PASSWORD_ENC_KEY')).update(pw).digest('hex');
  }

  async checkUserAndSignJWT(user: UserCredentials): Promise<AuthenticationResponse> {
    await connectDB;
    let usersHashedPass = this.encryptUsersPassword(user.password);
    let userDB: UserDBCreds = await UsersModel.findOne({ email: user.email });
    console.log(`userDB: ${userDB}`);
    if (userDB.passwordHash === usersHashedPass) {
      let JWTToken: string = this.service.signJWTToken(user.email);
      return {
        statusCode: 200,
        content: { token: JWTToken },
      };
    } else {
      return {
        statusCode: 404,
        content: { errorMessage: 'User not found' },
      };
    }
  }

  async signUp(user: UserCredentials): Promise<SignUpResponse> {
    let hashedPass = this.encryptUsersPassword(user.password);
    return await this.service.signUp(user.email, hashedPass);
  }
}
