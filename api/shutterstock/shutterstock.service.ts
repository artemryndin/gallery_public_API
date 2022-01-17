import { HttpError } from '@errors/http/http-error';
import { log } from '@helper/logger';
import axios from 'axios';
import { getEnv } from '@helper/environment';
import { S3Service } from '@services/s3.service';
import * as sstk from 'shutterstock-api';
import { ShutterstockSearchParameters, ShutterstockImage } from './shutterstock.interface';

sstk.setAccessToken(`${getEnv('SHUTTERSTOCK_TOCKEN')}`);

export class ShutterstockService {
  private imagesApi: sstk.ImagesApi;
  private S3: S3Service = new S3Service();
  private galleryBucket: string = getEnv('GALLERY_BUCKET');

  constructor() {
    this.imagesApi = new sstk.ImagesApi();
  }

  async findImages(query: ShutterstockSearchParameters): Promise<Array<ShutterstockImage>> {
    const reply = await this.imagesApi.searchImages(query);
    log(reply);
    if (!reply.data) {
      throw new HttpError(500, 'request failed', 'Request to Shutterstock API failed');
    }
    return reply.data.map((elem) => {
      return {
        id: elem.id,
        url: elem.assets.huge_thumb.url,
        contributor_id: elem.contributor.id,
        description: elem.description,
        image_type: elem.image_type,
        media_type: elem.media_type,
      };
    });
  }

  async saveOriginalImageToS3(image: ShutterstockImage): Promise<void> {
    log('saveOriginalImage started');
    const response = await axios.get(image.url, { responseType: 'arraybuffer' });
    log('saving original image to GALLERY_BUCKET');
    await this.S3.put(`${image.user}/${image.id}`, response.data, this.galleryBucket);
    log('Original image saved');
  }
}
