import type { AWS } from '@serverless/typescript';
import { authenticationConfig } from './config/serverless/parts/auth';
import { galleryConfig } from './config/serverless/parts/gallery';
import { joinParts } from './config/serverless/utils';
import { dynamoDBConfig } from './config/serverless/parts/dynamodb';
import { s3BucketConfig } from './config/serverless/parts/s3';
import { shutterstockConfig } from './config/serverless/parts/shutterstock';
import { s3SubclipBucketConfig } from './config/serverless/parts/s3_subclips';

const masterConfig: AWS = {
  service: 'aryndin-sls',
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
  authenticationConfig,
  galleryConfig,
  dynamoDBConfig,
  s3BucketConfig,
  s3SubclipBucketConfig,
  shutterstockConfig,
]);
