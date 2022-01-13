import { AWSPartitial } from '../types';

export const s3BucketConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}/images',
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
          BucketName: '${file(env.yml):${self:provider.stage}.GALLERY_BUCKET}',
          AccessControl: 'PublicReadWrite',
        },
      },
    },
  },
};
