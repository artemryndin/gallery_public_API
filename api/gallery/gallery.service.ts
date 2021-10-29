import { GalleryRequestParams, GalleryResponse, GalleryPayload, UploadResponse } from './gallery.interfaces';
import { errorHandler } from '@helper/http-api/error-handler';
import { S3Service } from '@services/s3.service';

export class GalleryService {
  private readonly S3: S3Service = new S3Service();

  async getGalleryPage(galleryQuery: GalleryRequestParams): Promise<GalleryResponse> {
    try {
      let galleryResponse: GalleryPayload = {
        //@ts-ignore
        objects: objects,
        page: galleryQuery.page,
        total: 0,
      };

      return { statusCode: 200, data: galleryResponse };
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }

  async saveFile(payload: string | NodeJS.ArrayBufferView, filename: string, user: string): Promise<UploadResponse> {
    try {
      await this.S3.put(filename, payload.toString(), 'aryndin-gallery-bucket');
      return { statusCode: 200, message: { message: 'The file is now saved to DB' } };
    } catch (err) {
      errorHandler(err);
      return { statusCode: 500, message: { errorMessage: err } };
    }
  }

  async saveFileToDB(filename: string, user: string): Promise<void> {
    return;
  }
}
