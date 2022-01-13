import { AWSPartitial } from '../types';

export const galleryConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*', 's3:*', 'sqs:SendMessage'],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}',
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}/index/*',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}/*',
              // 'arn:aws:sqs:${file(env.yml):${self:provider.region}}:*:GalleryQueue',
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
    getGalleryPage: {
      handler: 'api/gallery/handler.getGalleryPage',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery',
            method: 'get',
            cors: true,
            authorizer: {
              name: 'jwtauth',
            },
          },
        },
      ],
    },

    savePictureToDB: {
      handler: 'api/gallery/handler.savePictureToDB',
      memorySize: 128,
      events: [
        {
          s3: {
            bucket: '${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'images/',
              },
            ],
            existing: true,
          },
        },
      ],
    },

    getS3UploadLink: {
      handler: 'api/gallery/handler.getS3UploadLink',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/s3link',
            method: 'get',
            cors: true,
            integration: 'lambda-proxy',
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
