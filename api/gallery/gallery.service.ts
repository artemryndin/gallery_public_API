import { GalleryRequestParams, GalleryResponse, GalleryPayload, UploadResponse } from './gallery.interfaces';
import { S3Service } from '@services/s3.service';
import { ddbClient } from '@services/ddbClient';
import { PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getEnv } from '@helper/environment';
import { v4 as uuid4 } from 'uuid';
import { log } from '@helper/logger';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export class GalleryService {
  private S3: S3Service = new S3Service();
  private galleryTable: string = getEnv('GALLERY_TABLE');
  private galleryBucket: string = getEnv('GALLERY_BUCKET');

  async getGalleryPage(galleryQuery: GalleryRequestParams): Promise<GalleryResponse> {
    try {
      let params = {
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
          ':e': { S: galleryQuery.user },
          ':i': { S: 'image_' },
          ':s': { S: 'closed' },
        },
      };

      let dbResponse = await ddbClient.send(new QueryCommand(params));
      let images: Array<string | undefined> = dbResponse.Items ? dbResponse.Items.map((item) => item.s3link.S) : [];
      let adminImages: Array<string | undefined> = galleryQuery.filter ? [] : await this.getGalleryPictureAdmin();
      let galleryResponse: GalleryPayload = this.createGalleryResponse(
        images,
        adminImages,
        galleryQuery.limit,
        galleryQuery.page
      );

      return { statusCode: 200, data: galleryResponse };
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }

  async getGalleryPictureAdmin(): Promise<Array<string | undefined>> {
    try {
      let params = {
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

      let dbResponse = await ddbClient.send(new QueryCommand(params));
      let images: Array<string | undefined> = dbResponse.Items ? dbResponse.Items.map((item) => item.s3link.S) : [];

      return images;
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }

  async returnSignedPutURL(user: string): Promise<UploadResponse> {
    const id: string = uuid4();
    const link = this.S3.getPreSignedPutUrl(`${user}/${id}`, this.galleryBucket);
    const params = {
      TableName: this.galleryTable,
      Item: {
        email: { S: user },
        user_data: { S: `image_${id}` },
        s3link: { S: 'temp_link' },
        size: { S: 'temp_size' },
        id: { S: id },
        status: { S: 'open' },
      },
    };

    let result = await ddbClient.send(new PutItemCommand(params));
    log(result);
    return { statusCode: 200, message: link };
  }

  async saveFileToDB(user: string, pictureID: string, size: string) {
    let s3link: string = this.S3.getPreSignedGetUrl(`${user}/${pictureID}`, this.galleryBucket);

    const params = {
      TableName: this.galleryTable,
      Key: {
        email: { S: user },
        user_data: { S: `image_${pictureID}` },
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

    try {
      console.log(`Waiting for data to be updated in DB`);
      let result = await ddbClient.send(new UpdateItemCommand(params)).catch((err) => log({ error: err }));
      log(result);
    } catch (error) {
      log({ err: 'DB write operation failed' });
      throw new Error(`DB write operation failed\n${error}`);
    }
  }

  createGalleryResponse(
    arr1: Array<string | undefined>,
    arr2: Array<string | undefined>,
    limit: number,
    page: number
  ): GalleryPayload {
    let s3LinksArray: Array<string | undefined> = arr1
      .concat(arr2)
      .slice((page - 1) * limit, (page - 1) * limit + limit);
    let objectsArr: Array<string> = s3LinksArray.map((elem) => (elem === undefined ? '#' : elem));

    return {
      objects: objectsArr,
      page: page,
      total: Math.floor(s3LinksArray.length / limit) + 1,
    };
  }
}
