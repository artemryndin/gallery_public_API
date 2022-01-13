import type { AWS } from '@serverless/typescript';
import { authenticationConfig } from './config/serverless/parts/auth';
import { galleryConfig } from './config/serverless/parts/gallery';
import { joinParts } from './config/serverless/utils';
import { dynamoDBConfig } from './config/serverless/parts/dynamodb';
import { s3BucketConfig } from './config/serverless/parts/s3';
import { shutterstockConfig } from './config/serverless/parts/shutterstock';
import { s3SubclipBucketConfig } from './config/serverless/parts/s3_subclips';
import { SQSQueueConfig } from './config/serverless/parts/sqs';

const masterConfig: AWS = {
  service: 'artryndin-sls',
  configValidationMode: 'warn',
  variablesResolutionMode: '20210326',
  unresolvedVariablesNotificationMode: 'error',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "dev"}',
    lambdaHashingVersion: '20201221',
    // @ts-ignore
    region: '${file(./env.yml):${self:provider.stage}.REGION}',
    profile: '${file(./env.yml):${self:provider.stage}.PROFILE}',
    environment: {
      STAGE: '${self:provider.stage}',
    },
    tags: {
      client: '${file(./env.yml):${self:provider.stage}.CLIENT}',
    },
    // logs: {
    //   httpApi: true,
    // },
    httpApi: {
      useProviderTags: true,
      payload: '2.0',
      cors: true,
    },
  },
  package: {
    individually: true,
    patterns: ['bin/*'],
  },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: {
        forceExclude: ['aws-sdk'],
      },
      packagerOptions: {
        scripts: ['npm rebuild --arch=x64 --platform=linux sharp'],
      },
      concurrency: 5,
      serializedCompile: true,
      packager: 'npm',
    },
    prune: {
      automatic: true,
      number: 3,
    },
    envFiles: ['env.yml'],
    envEncryptionKeyId: {
      local: '${file(./kms_key.yml):local}',
      dev: '${file(./kms_key.yml):dev}',
      test: '${file(./kms_key.yml):test}',
      prod: '${file(./kms_key.yml):prod}',
    },
  },

  plugins: [
    '@redtea/serverless-env-generator',
    'serverless-webpack',
    'serverless-offline-sqs',
    'serverless-offline',
    'serverless-prune-plugin',
  ],
};

module.exports = joinParts(masterConfig, [
  SQSQueueConfig,
  dynamoDBConfig,
  // s3BucketConfig,
  // s3SubclipBucketConfig,
  authenticationConfig,
  galleryConfig,
  shutterstockConfig,
]);
