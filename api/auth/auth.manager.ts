import * as crypto from 'crypto';
import { AuthenticationResponse, SignUpResponse } from './auth.interface';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { LoginService } from './auth.service';
import { getEnv } from '@helper/environment';
import { ddbClient } from '@services/ddbClient';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { errorHandler } from '@helper/http-api/error-handler';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export class LoginManager {
  private readonly service: LoginService;
  constructor() {
    this.service = new LoginService();
  }

  encryptUsersPassword(pw: string): string {
    return crypto.createHmac('sha256', getEnv('PASSWORD_ENC_KEY')).update(pw).digest('hex');
  }

  async checkUserAndSignJWT(user: UserCredentials): Promise<AuthenticationResponse> {
    if (!user) {
      throw new Error('User not defined');
    }

    try {
      if (await this.checkUserPresenseInDB(user)) {
        return this.service.signJWTToken(user.email);
      } else return { statusCode: 401, content: { errorMessage: 'Invalid credentials' } };
    } catch (error) {
      errorHandler(error);
      return { statusCode: 500, content: { errorMessage: error } };
    }
  }

  async signUp(user: UserCredentials): Promise<SignUpResponse> {
    let hashedPass = this.encryptUsersPassword(user.password);
    return await this.service.signUp(user.email, hashedPass);
  }

  async checkUserPresenseInDB(userData: UserCredentials): Promise<boolean | undefined> {
    let params = {
      TableName: getEnv('GALLERY_TABLE'),
      Key: {
        email: { S: userData.email },
        user_data: { S: 'user' },
      },
    };

    let hashedPassword = crypto
      .createHmac('sha256', getEnv('PASSWORD_ENC_KEY'))
      .update(userData.password)
      .digest('hex');
    let userDB = await ddbClient.send(new GetItemCommand(params));
    let userDBUnmarshalled = unmarshall(userDB.Item!);

    return userDB.Item && hashedPassword == userDBUnmarshalled.passwordHash;
  }
}
