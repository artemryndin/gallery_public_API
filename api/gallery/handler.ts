import { GalleryManager } from './gallery.manager';
import { GalleryRequestParams, UploadResponse } from './gallery.interfaces';
import { createResponse } from '@helper/http-api/response';
import { errorHandler } from '@helper/http-api/error-handler';
import { APIGatewayProxyHandlerV2, S3Event } from 'aws-lambda';
import { log } from '@helper/logger';

export const getGalleryPage: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    if (event.queryStringParameters && event.requestContext.authorizer) {
      let QueryStringParams = event.queryStringParameters;

      let galleryRequest: GalleryRequestParams = {
        page: Number(QueryStringParams.page) ?? 1,
        limit: Number(QueryStringParams!.limit) ?? 5,
        filter: QueryStringParams!.filter === 'true' ? true : false,
        //@ts-ignore
        user: event.requestContext.authorizer.user,
      };

      const manager = new GalleryManager();
      const result = await manager.getGalleryPage(galleryRequest);

      return createResponse(result.statusCode, result.data);
    } else {
      return createResponse(400, 'query string parameters or user data not provided');
    }
  } catch (err) {
    return errorHandler(err);
  }
};

export const getS3UploadLink: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const manager = new GalleryManager();
    //@ts-ignore
    const user: string = event.requestContext.authorizer.user;
    console.log(`User: ${user}`);
    const result: UploadResponse = await manager.getS3SignedLink(user);
    return createResponse(result.statusCode, result.message);
  } catch (error) {
    return errorHandler(error);
  }
};

export const savePictureToDB = async (event: S3Event) => {
  log(event);

  try {
    const manager = new GalleryManager();
    await manager.savePictureToDB(event);
    return;
  } catch (err) {
    log({ error: 'savePictureToDB handler failed' });
  }
};
