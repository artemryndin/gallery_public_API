import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';
import { S3Service } from '@services/s3.service';
import { v4 as uuid4 } from 'uuid';
import { GalleryPayload, GalleryRequestParams, GalleryResponse, UploadResponse } from './gallery.interfaces';
import { DynamoClient } from '@services/ddbClient';

export class GalleryService {
  private S3: S3Service = new S3Service();
  private galleryBucket: string = getEnv('GALLERY_BUCKET');
  private subclipsBucket: string = getEnv('SUBCLIPS_BUCKET');
  private dynamoClient = new DynamoClient();

  async getGalleryPage(galleryQuery: GalleryRequestParams): Promise<GalleryResponse> {
    try {
      const images = await this.dynamoClient.getGalleryPage(galleryQuery.user);
      const adminImages: Array<string | undefined> = galleryQuery.filter ? [] : await this.getGalleryPictureAdmin();
      const galleryResponse: GalleryPayload = this.createGalleryResponse(
        images,
        adminImages,
        galleryQuery.limit,
        galleryQuery.page
      );

      return { statusCode: 200, data: galleryResponse };
    } catch (err) {
      throw new Error('failed to connect DB');
    }
  }

  async getGalleryPictureAdmin(): Promise<Array<string | undefined>> {
    return await this.dynamoClient.getGalleryPictureAdmin();
  }

  async returnSignedPutURL(user: string): Promise<UploadResponse> {
    const id: string = uuid4();
    const link = this.S3.getPreSignedPutUrl(`${user}/${id}`, this.galleryBucket);
    await this.dynamoClient.saveImageData(user, id);
    return { s3UploadLink: link };
  }

  async saveFileToDB(user: string, pictureID: string, size: string): Promise<void> {
    const s3link: string = this.S3.getPreSignedGetUrl(`${user}/${pictureID}`, this.galleryBucket);
    try {
      console.log(`Waiting for data to be updated in DB`);
      await this.dynamoClient.updateStatus(user, pictureID, s3link, size);
    } catch (error) {
      throw new Error(`DB write operation failed\n${error}`);
    }
  }

  async createSubclip(key: string): Promise<void> {
    log('createSubclip started');
    const originalImage = await this.S3.get(key, this.galleryBucket);
    log(originalImage.Body);
    //@ts-ignore
    const subclipBuffer = await Sharp(originalImage.Body).resize(512, 250).toBuffer();
    log('saving image to SUBCLIPS_BUCKET');
    await this.S3.put(key, subclipBuffer, this.subclipsBucket);
  }

  async updateSubclipStatus(user: string, filename: string): Promise<void> {
    await this.dynamoClient.updateSubclipStatus(filename, user);
  }

  createGalleryResponse(
    arr1: Array<string | undefined>,
    arr2: Array<string | undefined>,
    limit: number,
    page: number
  ): GalleryPayload {
    const s3LinksArray: Array<string | undefined> = arr1
      .concat(arr2)
      .slice((page - 1) * limit, (page - 1) * limit + limit);
    const objectsArr: Array<string> = s3LinksArray.map((elem) => (elem === undefined ? '#' : elem));

    return {
      objects: objectsArr,
      page: page,
      total: Math.floor(s3LinksArray.length / limit) + 1,
    };
  }
}
