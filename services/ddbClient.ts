import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getEnv } from '@helper/environment';

const REGION: string = getEnv('GALLERY_TABLE');
const ddbClient = new DynamoDBClient({ region: REGION });

export { ddbClient };
