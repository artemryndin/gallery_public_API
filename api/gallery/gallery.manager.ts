import { log } from '@helper/logger';
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

  async savePictureToDB(event: S3Event): Promise<void> {
    try {
      const user = decodeURIComponent(event.Records[0].s3.object.key.split('/')[0]);
      const filename = event.Records[0].s3.object.key.split('/')[1];
      const size = event.Records[0].s3.object.size.toString();

      await this.service.saveFileToDB(user, filename, size).then((data) => log(`${data} saved to DB`));
      await this.service.createSubclip(`${user}/${filename}`);
    } catch (error) {
      log({ err: 'savePictureToDB manager failed' });
    }
  }

  async updateSubclipStatus(event: S3Event): Promise<void> {
    const user = decodeURIComponent(event.Records[0].s3.object.key.split('/')[0]);
    const filename = event.Records[0].s3.object.key.split('/')[1];
    await this.service.updateSubclipStatus(user, filename);
  }
}
