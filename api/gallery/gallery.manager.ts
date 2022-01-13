import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';
import { SQSService } from '@services/sqs.service';
import { S3Event } from 'aws-lambda/trigger/s3';
import { GalleryRequestParams, GalleryResponse, UploadResponse } from './gallery.interfaces';
import { GalleryService } from './gallery.service';
import { SQS } from 'aws-sdk';

export class GalleryManager {
  private readonly service: GalleryService;
  private readonly sqs: SQS;

  constructor() {
    this.service = new GalleryService();
    this.sqs = new SQS();
  }

  async getGalleryPage(queryParams: GalleryRequestParams): Promise<GalleryResponse> {
    return await this.service.getGalleryPage(queryParams);
  }

  async getS3SignedLink(user: string): Promise<UploadResponse> {
    return this.service.returnSignedPutURL(user);
  }

  async savePictureToDB(event: S3Event) {
    try {
      const user = decodeURIComponent(event.Records[0].s3.object.key.split('/')[0]);
      const filename = event.Records[0].s3.object.key.split('/')[1];
      const size = event.Records[0].s3.object.size.toString();

      await this.service.saveFileToDB(user, filename, size).then((data) => log(`${data} saved to DB`));
      this.sqs.sendMessage({ QueueUrl: getEnv('GalleryQueueUrl'), MessageBody: event.Records[0].s3.object.key });
    } catch (error) {
      log({ err: 'savePictureToDB manager failed' });
    }
  }
}
