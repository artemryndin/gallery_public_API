import { AWSPartitial } from '../types';

export const authenticationConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: '*',
          },
        ],
      },
    },
  },
  functions: {
    signUp: {
      handler: 'api/auth/handler.signUp',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/signup',
            method: 'post',
            cors: true,
            integration: 'lambda-proxy',
          },
        },
      ],
    },

    login: {
      handler: 'api/auth/handler.login',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/login',
            method: 'post',
            cors: true,
            integration: 'lambda-proxy',
          },
        },
      ],
    },
  },
};
