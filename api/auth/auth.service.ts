import { HttpBadRequestError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';
import * as jwt from 'jsonwebtoken';
import { AuthenticationResponse, SignUpResponse } from './auth.interface';
import { ddbClient } from '@services/ddbClient';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

export class LoginService {
  signJWTToken(userEmail: string): AuthenticationResponse {
    const token = jwt.sign({ email: userEmail }, getEnv('TOKEN_KEY'));
    return { token: token };
  }

  async signUp(userEmail: string, hashedPassword: string): Promise<SignUpResponse> {
    log('sign up service started');
    const params = {
      TableName: getEnv('GALLERY_TABLE'),
      Item: {
        email: { S: userEmail },
        user_data: { S: 'user' },
        passwordHash: { S: hashedPassword },
      },
    };
    log('service trying to get user from DynamoDB');
    const data = await ddbClient.send(
      new GetItemCommand({
        TableName: params.TableName,
        Key: { email: params.Item.email, user_data: params.Item.user_data },
      })
    );
    log('Data');
    log(data);
    if (!data.Item) {
      log('no user found in DynamoDB, creating new user');
      const user = await ddbClient.send(new PutItemCommand(params));
      log('User');
      log(user);
      return { info: { message: 'Signed up' } };
    } else {
      log('User already exists');
      throw new HttpBadRequestError('User already exists');
      // return { statusCode: 400, message: { errorMessage: 'User already exists' } };
    }
  }
}
