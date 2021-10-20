import { config } from 'dotenv';
config();
import { log } from '@helper/logger';
import {
  APIGatewayAuthorizerSimpleResult,
  APIGatewayRequestAuthorizerHttpApiPayloadV2Event,
} from '@interfaces/api-gateway-authorizer';
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerWithContextHandler } from 'aws-lambda';
import { Handler } from 'aws-lambda/handler';
import * as JWT from 'jsonwebtoken';
import { UsersModel } from '@models/MongoDB/db_user_schema';
import { Response } from '@helper/http-api/response';

const UNAUTHORIZED = new Error('Unauthorized');

export const myJWTAuth = async (event) => {
  log(event);

  const token = event.authorizationToken.split(' ')[1];
  try {
    let user = JWT.verify(token, process.env.TOKEN_KEY);
    return generatePolicy('user', 'Allow', '*', { user: user.email });
  } catch (err) {
    return generatePolicy('user', 'Deny', '*', {});
  }
};

export function generatePolicy<C extends APIGatewayAuthorizerResult['context']>(
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context: C
): APIGatewayAuthorizerResult & { context: C } {
  const authResponse: APIGatewayAuthorizerResult & { context: C } = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  return authResponse;
}
