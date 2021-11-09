import { log } from '@helper/logger';
import { S3Event } from 'aws-lambda/trigger/s3';
import { GalleryRequestParams, GalleryResponse, UploadResponse } from './gallery.interfaces';
import { GalleryService } from './gallery.service';

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
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
      return;
    } catch (error) {
      log({ err: 'savePictureToDB manager failed' });
    }
  }
}
