import { log } from '@helper/logger';
import { SignUpManager } from './sign_up.manager';
import { SignUpService } from './sign_up.service';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { SignUpResponse } from './sign_up.interface';
import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const signUpHandler: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const credentials: UserCredentials = JSON.parse(event.body!);
    const manager = new SignUpManager();
    const service = new SignUpService();
    const result: SignUpResponse = await manager.signUp(credentials, service);

    return createResponse(result.statusCode, result.message);
  } catch (error) {
    return errorHandler(error);
  }
};
