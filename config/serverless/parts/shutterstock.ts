import { AWSPartitial } from '../types';

export const shutterstockConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*', 's3:*'],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}',
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}/index/*',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}/*',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}/*',
            ],
          },
        ],
      },
    },
    httpApi: {
      authorizers: {
        jwtauth: {
          type: 'request',
          enableSimpleResponses: true,
          functionName: 'jwtauth',
          identitySource: '$request.header.Authorization',
        },
      },
    },
  },
  functions: {
    findImages: {
      handler: 'api/shutterstock/handler.findImages',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/shutterstock',
            method: 'get',
            integration: 'lambda-proxy',
            cors: true,
            authorizer: {
              name: 'jwtauth',
            },
          },
        },
      ],
    },

    chooseImages: {
      handler: 'api/shutterstock/handler.chooseImages',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/shutterstock',
            method: 'post',
            integration: 'lambda-proxy',
            cors: true,
            authorizer: {
              name: 'jwtauth',
            },
          },
        },
      ],
    },

    jwtauth: {
      handler: 'api/auth/authorizer.authorizer',
      memorySize: 128,
    },
  },
};
