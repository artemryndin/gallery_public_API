import { AWSPartitial } from '../types';

export const dynamoDBConfig: AWSPartitial = {
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

  resources: {
    Resources: {
      galleryTable: {
        DeletionPolicy: 'Delete',
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${file(env.yml):${self:provider.stage}.GALLERY_TABLE}',
          KeySchema: [
            {
              AttributeName: 'email',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'user_data',
              KeyType: 'RANGE',
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'email',
              AttributeType: 'S',
            },
            {
              AttributeName: 'user_data',
              AttributeType: 'S',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
    },
  },
};
