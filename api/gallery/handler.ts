import * as multipartParser from 'lambda-multipart-parser';
import { GalleryManager } from './gallery.manager';
import { GalleryRequestParams, UploadResponse } from './gallery.interfaces';
import { createResponse } from '@helper/http-api/response';
import { errorHandler } from '@helper/http-api/error-handler';
import { log } from 'console';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

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
        user: event.requestContext.authorizer.claims.user.toString(),
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

export const uploadPicture: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  try {
    const manager = new GalleryManager();
    //@ts-ignore
    const payload = await multipartParser.parse(event);
    //@ts-ignore
    const user: string = event.requestContext.authorizer?.jwt?.claims.user;

    const result: UploadResponse = await manager.uploadPicture(
      payload.files[0].content,
      payload.files[0].filename,
      user
    );
    return createResponse(result.statusCode, result.message);
  } catch (error) {
    return errorHandler(error);
  }
};
