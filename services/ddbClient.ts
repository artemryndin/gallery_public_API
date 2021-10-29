import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const REGION: string = 'eu-central-1';
const ddbClient = new DynamoDBClient({ region: REGION });

export { ddbClient };
