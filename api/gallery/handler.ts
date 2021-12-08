import { GalleryManager } from './gallery.manager';
import { GalleryRequestParams, GalleryResponse, UploadResponse } from './gallery.interfaces';
import { createResponse } from '@helper/http-api/response';
import { errorHandler } from '@helper/http-api/error-handler';
import { APIGatewayProxyHandlerV2, APIGatewayProxyResult, S3Event } from 'aws-lambda';
import { log } from '@helper/logger';

export const getGalleryPage: APIGatewayProxyHandlerV2<GalleryResponse | APIGatewayProxyResult> = async (event) => {
  log(event);

  try {
    if (event.queryStringParameters && event.requestContext.authorizer) {
      const QueryStringParams = event.queryStringParameters;

      const galleryRequest: GalleryRequestParams = {
        page: Number(QueryStringParams.page) ?? 1,
        limit: Number(QueryStringParams!.limit) ?? 5,
        filter: QueryStringParams!.filter === 'true' ? true : false,
        //@ts-ignore
        user: event.requestContext.authorizer.user,
      };

      const manager = new GalleryManager();
      const result = await manager.getGalleryPage(galleryRequest);
      return result;
    } else {
      return createResponse(400, 'query string parameters or user data not provided');
    }
  } catch (err) {
    return errorHandler(err);
  }
};

export const getS3UploadLink: APIGatewayProxyHandlerV2<UploadResponse> = async (event) => {
  log(event);

  try {
    const manager = new GalleryManager();
    //@ts-ignore
    const user: string = event.requestContext.authorizer.user;
    log(`User: ${user}`);
    const result: UploadResponse = await manager.getS3SignedLink(user);
    return result;
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
