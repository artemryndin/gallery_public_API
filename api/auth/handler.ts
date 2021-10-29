import { createResponse } from '@helper/http-api/response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoginManager } from './auth.manager';
import { AuthenticationResponse, SignUpResponse } from './auth.interface';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { errorHandler } from '@helper/http-api/error-handler';

export const login: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userCreds: UserCredentials = JSON.parse(event.body!);
    const manager = new LoginManager();
    const result: AuthenticationResponse = await manager.checkUserAndSignJWT(userCreds);
    return createResponse(result.statusCode, result.content);
  } catch (err) {
    return errorHandler(err);
  }
};

export const signUp: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userCreds: UserCredentials = JSON.parse(event.body!);
    const manager = new LoginManager();
    const result: SignUpResponse = await manager.signUp(userCreds);
    return createResponse(result.statusCode, result.message);
  } catch (error) {
    return errorHandler(error);
  }
};
