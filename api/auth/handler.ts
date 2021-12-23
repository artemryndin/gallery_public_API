import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { AuthenticationResponse, SignUpResponse } from './auth.interface';
import { LoginManager } from './auth.manager';

export const login: APIGatewayProxyHandlerV2<AuthenticationResponse> = async (event) => {
  log(event);

  try {
    const userCreds: UserCredentials = JSON.parse(event.body!);
    const manager = new LoginManager();
    const managerResult = await manager.checkUserAndSignJWT(userCreds);
    log(managerResult);
    return createResponse(200, managerResult);
  } catch (err) {
    log(err);
    return errorHandler(err);
  }
};

export const signUp: APIGatewayProxyHandlerV2<SignUpResponse> = async (event) => {
  log(event);
  try {
    const userCreds: UserCredentials = JSON.parse(event.body!);
    const manager = new LoginManager();
    const managerResult = await manager.signUp(userCreds);
    log(managerResult);
    return createResponse(200, managerResult);
  } catch (error) {
    log(error);
    return errorHandler(error);
  }
};
