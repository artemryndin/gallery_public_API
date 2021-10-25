import { createResponse } from '@helper/http-api/response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoginManager } from './login.manager';
import { LoginService } from './login.service';
import { AuthenticationFailure, UserJWTToken } from './login.interface';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { errorHandler } from '@helper/http-api/error-handler';
import { HttpBadRequestError } from '@errors/http';

export const loginGetRequestHandler: APIGatewayProxyHandlerV2 = async (event) => {
  return createResponse(200, { message: 'login GET request' });
};

export const loginPostRequestHandler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userCreds: UserCredentials = JSON.parse(event.body!);
    const manager = new LoginManager();
    const result: UserJWTToken | HttpBadRequestError = await manager.checkUserAndSignJWT(userCreds);
    return createResponse(200, result);
  } catch (err) {
    return errorHandler(err);
  }
};
