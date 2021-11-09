import { config } from 'dotenv';
config();
import { log } from '@helper/logger';
import { APIGatewayAuthorizerResult } from 'aws-lambda';
import * as JWT from 'jsonwebtoken';
import { getEnv } from '@helper/environment';

const UNAUTHORIZED = new Error('Unauthorized');

export const authorizer = async (event) => {
  log(event);

  const token = event.authorizationToken.split(' ')[1];
  try {
    let user = JWT.verify(token, getEnv('TOKEN_KEY'));
    return generatePolicy('user', 'Allow', '*', { user: user.email, body: event.body });
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
