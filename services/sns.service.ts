import { SNSClient } from '@aws-sdk/client-sns';
import { CreateTopicCommand } from '@aws-sdk/client-sns';
import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';

const REGION = getEnv('REGION');
const snsClient = new SNSClient({ region: REGION });
const params = { Name: getEnv('SNS_TOPIC_NAME') };

export const run = async () => {
  try {
    const data = await snsClient.send(new CreateTopicCommand(params));
    log('Succeed', data);
    return data;
  } catch (err) {
    log('Error', err.stack);
  }
};
