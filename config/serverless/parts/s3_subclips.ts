import { AWSPartitial } from '../types';

export const s3SubclipBucketConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}/*',
            ],
          },
        ],
      },
    },
  },

  resources: {
    Resources: {
      GalleryBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${file(env.yml):${self:provider.stage}.SUBCLIPS_BUCKET}',
          AccessControl: 'PublicReadWrite',
        },
      },
    },
  },
};
