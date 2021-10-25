import { connectDB } from '@services/db_connection';
import { GalleryRequestParams, GalleryResponse } from './gallery.interfaces';
import { picturesModel } from '@models/MongoDB/picture.model';

export class GalleryService {
  async getGalleryPage(galleryQuery: GalleryRequestParams) {
    try {
      let pictureOwner = galleryQuery.filter ? { owner: galleryQuery.user } : {};

      console.table(pictureOwner);
      await connectDB;

      let objects = await picturesModel
        .find(pictureOwner)
        .lean()
        .skip((galleryQuery.page - 1) * galleryQuery.limit)
        .limit(galleryQuery.limit);

      objects = objects.map((elem) => elem.path);

      console.log(`Objects: ${objects}`);
      let total: number = Math.floor((await picturesModel.find(pictureOwner).count()) / galleryQuery.limit) + 1;

      let galleryGetResponse: GalleryResponse = {
        //@ts-ignore
        objects: objects,
        page: galleryQuery.page,
        total: total,
      };

      return galleryGetResponse;
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }
}
