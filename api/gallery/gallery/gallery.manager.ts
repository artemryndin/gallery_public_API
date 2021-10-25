import { GalleryRequestParams } from './gallery.interfaces';
import { GalleryService } from './gallery.service';

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  async getGalleryPage(queryParams: GalleryRequestParams) {
    return await this.service.getGalleryPage(queryParams);
  }
}
