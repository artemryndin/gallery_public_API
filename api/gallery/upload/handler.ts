import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { log } from '@helper/logger';
import { UploadManager } from './upload.manager';
import * as parser from 'lambda-multipart-parser';
import { createResponse } from '@helper/http-api/response';
import { errorHandler } from '@helper/http-api/error-handler';
import { UploadResponse } from './upload.interface';

// : APIGatewayProxyHandlerV2

export const uploadPicture = async (event) => {
  log(event);

  try {
    const manager: UploadManager = new UploadManager();
    const payload = await parser.parse(event);
    //@ts-ignore
    const user: string = event.requestContext.authorizer.claims.user;

    const result: UploadResponse = await manager.uploadPicture(
      payload.files[0].content,
      payload.files[0].filename,
      user
    );
    return createResponse(200, result);
  } catch (error) {
    return errorHandler(error);
  }
};
