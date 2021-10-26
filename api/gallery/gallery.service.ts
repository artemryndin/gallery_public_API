import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { connectDB } from '@services/db_connection';
import { GalleryRequestParams, GalleryResponse, GalleryPayload, UploadResponse } from './gallery.interfaces';
import { picturesModel } from '@models/MongoDB/picture.model';
import { errorHandler } from '@helper/http-api/error-handler';
const stat = util.promisify(fs.stat);

export class GalleryService {
  private readonly FOLDER_PATH: string = '../../../../pictures';

  async getGalleryPage(galleryQuery: GalleryRequestParams): Promise<GalleryResponse> {
    try {
      let pictureOwner = galleryQuery.filter ? { owner: galleryQuery.user } : {};
      await connectDB;

      let objects = await picturesModel
        .find(pictureOwner)
        .lean()
        .skip((galleryQuery.page - 1) * galleryQuery.limit)
        .limit(galleryQuery.limit);

      objects = objects.map((elem) => elem.path);
      let total: number = Math.floor((await picturesModel.find(pictureOwner).count()) / galleryQuery.limit) + 1;
      let galleryResponse: GalleryPayload = {
        //@ts-ignore
        objects: objects,
        page: galleryQuery.page,
        total: total,
      };

      return { statusCode: 200, data: galleryResponse };
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }

  async saveFile(payload: string | NodeJS.ArrayBufferView, filename: string, user: string): Promise<UploadResponse> {
    try {
      fs.writeFile(path.join(__dirname, `${this.FOLDER_PATH}/${filename}`), payload, (err: any) => {
        if (err) console.error(err);
      });

      await this.saveFileToDB(filename, user);
      return { statusCode: 200, message: { message: 'The file is now saved to DB' } };
    } catch (err) {
      errorHandler(err);
      return { statusCode: 500, message: { errorMessage: err } };
    }
  }

  async saveFileToDB(filename: string, user: string): Promise<void> {
    await connectDB;
    const metadata = await stat(path.join(__dirname, `${this.FOLDER_PATH}/${filename}`));

    await picturesModel.create({
      path: filename,
      metadata: metadata,
      owner: user,
    });
  }
}
