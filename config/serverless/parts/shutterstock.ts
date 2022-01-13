import { GetAtt } from '../cf-intristic-fn';
import { AWSPartitial } from '../types';

export const shutterstockConfig: AWSPartitial = {
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
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}/',
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

    saveOriginalImage: {
      handler: 'api/shutterstock/handler.saveOriginalImage',
      memorySize: 128,
      events: [
        {
          sqs: {
            arn: GetAtt('ShutterstockQueue.Arn'),
          },
        },
      ],
    },

    createSubclip: {
      handler: 'api/shutterstock/handler.createImageSubclip',
      memorySize: 128,
      events: [
        {
          s3: {
            bucket: '${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'shutterstock/',
              },
            ],
            existing: true,
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
