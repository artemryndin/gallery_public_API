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
            Resource: [
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}',
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}/index/*',
            ],
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
          httpApi: {
            path: '/signup',
            method: 'post',
          },
        },
      ],
    },

    login: {
      handler: 'api/auth/handler.login',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/login',
            method: 'post',
          },
        },
      ],
    },
  },
};
