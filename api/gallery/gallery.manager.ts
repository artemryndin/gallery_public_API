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

  async uploadPicture(
    payload: string | NodeJS.ArrayBufferView,
    filename: string,
    user: string
  ): Promise<UploadResponse> {
    return await this.service.saveFile(payload, filename, user);
  }
}
