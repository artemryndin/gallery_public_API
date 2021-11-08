import { getEnv } from '@helper/environment';
import * as jwt from 'jsonwebtoken';
import { AuthenticationResponse, SignUpResponse } from './auth.interface';
import { ddbClient } from '@services/ddbClient';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

export class LoginService {
  signJWTToken(userEmail: string): AuthenticationResponse {
    let token = jwt.sign({ email: userEmail }, getEnv('TOKEN_KEY'));
    return { statusCode: 200, content: { token: token } };
  }

  async signUp(userEmail: string, hashedPassword: string): Promise<SignUpResponse> {
    let params = {
      TableName: getEnv('GALLERY_TABLE'),
      Item: {
        email: { S: userEmail },
        user_data: { S: 'user' },
        passwordHash: { S: hashedPassword },
      },
    };

    let data = await ddbClient.send(
      new GetItemCommand({
        TableName: params.TableName,
        Key: { email: params.Item.email, user_data: params.Item.user_data },
      })
    );
    if (!data.Item) {
      const user = await ddbClient.send(new PutItemCommand(params));
      return { statusCode: 200, message: { message: 'Signed up' } };
    } else {
      return { statusCode: 400, message: { errorMessage: 'User already exists' } };
    }
  }
}
