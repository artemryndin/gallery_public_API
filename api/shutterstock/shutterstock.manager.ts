import { HttpError } from '@errors/http/http-error';
import { shutterstockAPIQuerySchema } from '@helper/joi_schema';
import { ShutterstockImage, ShutterstockSearchParameters } from './shutterstock.interface';
import { ShutterstockService } from './shutterstock.service';

export class ShutterstockManager {
  private service: ShutterstockService;

  constructor() {
    this.service = new ShutterstockService();
  }

  async findImages(queryParams: ShutterstockSearchParameters): Promise<Array<ShutterstockImage>> {
    if (!(await shutterstockAPIQuerySchema.validate(queryParams))) {
      throw new HttpError(400, 'Validation error', 'Query string params validation failed');
    }
    return this.service.findImages(queryParams);
  }

  async chooseImages(images: Array<ShutterstockImage>, user: string): Promise<void> {
    if (images.length === 0) {
      throw new HttpError(400, 'No data', 'Images list is empty');
    }
    for (const elem of images) {
      await this.service.saveOriginalImageToS3(elem, user);
    }
    return;
  }

  async createSubclip(key: string): Promise<void> {
    return this.service.createSubclip(key);
  }
}
