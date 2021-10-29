import { AWSPartitial } from '../types';

export const dynamoDBConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem',
            ],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}',
              'arn:aws:dynamodb:*:*:table/${file(env.yml):${self:provider.stage}.GALLERY_TABLE}/index/*',
            ],
          },
        ],
      },
    },
  },

  resources: {
    Resources: {
      galleryTable: {
        DeletionPolicy: 'Retain',
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'aryndin_gallery',
          KeySchema: [
            {
              AttributeName: 'email',
              KeyType: 'HASH',
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'email',
              AttributeType: 'S',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
    },
  },
};
