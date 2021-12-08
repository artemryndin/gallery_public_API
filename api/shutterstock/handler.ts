import { HttpError } from '@errors/http/http-error';
import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ShutterstockImage } from './shutterstock.interface';
import { ShutterstockManager } from './shutterstock.manager';

export const findImages: APIGatewayProxyHandlerV2<Array<ShutterstockImage> | undefined> = async (event) => {
  // log(event);

  try {
    const manager = new ShutterstockManager();
    if (event.body && event.requestContext.authorizer) {
      return await manager.findImages(JSON.parse(event.body));
    } else {
      createResponse(400, { errorMessage: 'Request body is empty' });
    }
  } catch (err) {
    errorHandler(err);
  }
};

export const chooseImages: APIGatewayProxyHandlerV2<void> = async (event) => {
  // log(event);

  try {
    const manager = new ShutterstockManager();
    if (event.body && event.requestContext.authorizer) {
      //@ts-ignore
      return await manager.chooseImages(JSON.parse(event.body), event.requestContext.authorizer.user);
    }
  } catch (err) {
    errorHandler(err);
  }
};

// export const createImageSubclip = async(event: S3Event) => {
//   log(event);
//
//   try {
//     const manager = new ShutterstockManager();
//
//   }
// }
