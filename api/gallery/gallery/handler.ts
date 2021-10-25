import { GalleryManager } from './gallery.manager';
import { GalleryService } from './gallery.service';
import { GalleryRequestParams } from './gallery.interfaces';
import { createResponse } from '@helper/http-api/response';
import { errorHandler } from '@helper/http-api/error-handler';
import { log } from 'console';

export const getGalleryPage = async (event) => {
  log(event);

  try {
    let QueryStringParams = event.queryStringParameters;

    let galleryRequest: GalleryRequestParams = {
      page: QueryStringParams.page,
      limit: QueryStringParams.limit,
      filter: QueryStringParams.filter === 'true' ? true : false,
      user: event.requestContext.authorizer.claims.user,
    };

    const manager = new GalleryManager();
    const service = new GalleryService();
    const result = await manager.getGalleryPage(galleryRequest);

    return createResponse(200, result);
  } catch (err) {
    return errorHandler(err);
  }
};
