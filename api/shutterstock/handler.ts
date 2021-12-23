import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ShutterstockImage, ShutterstockSearchParameters } from './shutterstock.interface';
import { ShutterstockManager } from './shutterstock.manager';

export const findImages: APIGatewayProxyHandlerV2<Array<ShutterstockImage> | undefined> = async (event) => {
  log(event);

  try {
    const manager = new ShutterstockManager();
    if (event.queryStringParameters && event.requestContext.authorizer) {
      const params: ShutterstockSearchParameters = event.queryStringParameters;
      const managerResponse = await manager.findImages(params);
      log(managerResponse);
      return createResponse(200, managerResponse);
    } else {
      return createResponse(400, { errorMessage: 'Request body is empty' });
    }
  } catch (err) {
    log(err);
    errorHandler(err);
  }
};

export const chooseImages: APIGatewayProxyHandlerV2<void> = async (event) => {
  log(event);

  try {
    const manager = new ShutterstockManager();
    if (event.body && event.requestContext.authorizer) {
      //@ts-ignore
      await manager.chooseImages(JSON.parse(event.body), event.requestContext.authorizer.user);
      return createResponse(200, 'success');
    }
  } catch (err) {
    log(err);
    errorHandler(err);
  }
};

export const createImageSubclip = async (event: S3Event) => {
  log(event);

  try {
    const manager = new ShutterstockManager();
    const key = event.Records[0].s3.object.key;
    return await manager.createSubclip(key);
  } catch (err) {
    log(err);
    errorHandler(err);
  }
};
