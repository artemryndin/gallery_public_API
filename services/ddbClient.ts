import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getEnv } from '@helper/environment';

const REGION = getEnv('REGION');
const ddbClient = new DynamoDBClient({ region: REGION });

export { ddbClient };
