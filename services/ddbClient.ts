import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';

export class DynamoClient {
  private REGION = getEnv('REGION');
  private ddbClient = new DynamoDBClient({ region: this.REGION });
  private galleryTable: string = getEnv('GALLERY_TABLE');

  //@ts-ignore
  public async checkUserPresenceInDB(email: string): Promise<any> {
    const params = {
      TableName: getEnv('GALLERY_TABLE'),
      Key: {
        email: { S: email },
        user_data: { S: 'user' },
      },
    };
    return await this.ddbClient.send(new GetItemCommand(params));
  }

  //@ts-ignore
  public async createUser(email: string, hashedPassword: string): Promise<any> {
    const params = {
      TableName: getEnv('GALLERY_TABLE'),
      Item: {
        email: { S: email },
        user_data: { S: 'user' },
        passwordHash: { S: hashedPassword },
      },
    };

    return await this.ddbClient.send(new PutItemCommand(params));
  }

  public async saveImageData(id: string, user: string): Promise<void> {
    const params = {
      TableName: this.galleryTable,
      Item: {
        email: { S: user },
        user_data: { S: `image_${id}` },
        s3link: { S: 'temp_link' },
        size: { S: 'temp_size' },
        id: { S: id },
        status: { S: 'open' },
        subclip_created: { BOOL: false },
      },
    };
    const result = await this.ddbClient.send(new PutItemCommand(params));
    log(result);
  }

  public async updateSubclipStatus(id: string, user: string): Promise<void> {
    const params = {
      TableName: this.galleryTable,
      Key: {
        email: { S: user },
        user_data: { S: `image_${id}` },
      },
      UpdateExpression: 'SET #subclipCreated = :sbc',
      ExpressionAttributeNames: {
        '#subclipCreated': 'subclipCreated',
      },
      ExpressionAttributeValues: {
        ':sbc': { BOOL: true },
      },
    };
    await this.ddbClient.send(new UpdateItemCommand(params));
  }

  public async updateStatus(user: string, id: string, s3link: string, size: string): Promise<void> {
    const params = {
      TableName: this.galleryTable,
      Key: {
        email: { S: user },
        user_data: { S: `image_${id}` },
      },
      UpdateExpression: 'SET #link = :l, #size = :sz, #status = :st',
      ExpressionAttributeNames: {
        '#link': 's3link',
        '#size': 'size',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':l': { S: `${s3link}` },
        ':sz': { S: `${size}` },
        ':st': { S: 'closed' },
      },
    };
    await this.ddbClient.send(new UpdateItemCommand(params));
  }

  public async getGalleryPage(user: string): Promise<Array<string | undefined>> {
    try {
      const params = {
        TableName: this.galleryTable,
        KeyConditionExpression: `#E = :e AND begins_with(#UD, :i)`,
        FilterExpression: '#ST = :s',
        ProjectionExpression: '#S3',
        ExpressionAttributeNames: {
          '#E': 'email',
          '#UD': 'user_data',
          '#ST': 'status',
          '#S3': 's3link',
        },
        ExpressionAttributeValues: {
          ':e': { S: user },
          ':i': { S: 'image_' },
          ':s': { S: 'closed' },
        },
      };
      const response = await this.ddbClient.send(new QueryCommand(params));
      return response.Items ? response.Items.map((item) => item.s3link.S) : [];
    } catch (e) {
      throw new Error('DynamoDB Request failed');
    }
  }

  public async getGalleryPictureAdmin(): Promise<Array<string | undefined>> {
    try {
      const params = {
        TableName: this.galleryTable,
        KeyConditionExpression: `#E = :e AND begins_with(#UD, :i)`,
        FilterExpression: '#ST = :s',
        ProjectionExpression: '#S3',
        ExpressionAttributeNames: {
          '#E': 'email',
          '#UD': 'user_data',
          '#ST': 'status',
          '#S3': 's3link',
        },
        ExpressionAttributeValues: {
          ':e': { S: 'admin' },
          ':i': { S: 'image_' },
          ':s': { S: 'closed' },
        },
      };

      const dbResponse = await this.ddbClient.send(new QueryCommand(params));
      return dbResponse.Items ? dbResponse.Items.map((item) => item.s3link.S) : [];
    } catch (err) {
      throw new HttpInternalServerError('failed to connect DB');
    }
  }
}
