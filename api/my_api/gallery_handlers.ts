import { errorHandler } from '@helper/http-api/error-handler';
import { Response } from '@helper/http-api/response';
import { log } from '@helper/logger';
import * as JWT from 'jsonwebtoken';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { dbResponse } from '@interfaces/gallery_interfaces';
import { picturesModel } from '@models/MongoDB/db_picture_schema';
import { connectDB } from '@helper/db_connection';
import { config } from 'dotenv';
config();

export const getGallery: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);
  //@ts-ignore
  console.log(`event.requestContext.authorizer.claims.user: ${event.requestContext.authorizer.claims.user.toString()}`);
  try {
    let response = new Response({
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    if (event.headers.Authorization) {
      let page: number = Number(event?.queryStringParameters?.page) || 1;
      let limit: number = Number(event?.queryStringParameters?.limit) || 5;
      let filter: string = event?.queryStringParameters?.filter || 'false';
      //@ts-ignore
      let user: string = event.requestContext.authorizer.claims.user;

      let responseBody = await requestPicturesFromDB(page, limit, filter, user);
      return response.create(200, responseBody);
    } else return response.create(401, { errorMessage: 'Unauthorizaed' });
  } catch (error) {
    return errorHandler(error);
  }
};

const requestPicturesFromDB = async (page: number, limit: number, filter: string, user: string) => {
  await connectDB();
  let pictures: Array<any> =
    filter === 'true'
      ? await picturesModel
          .find({ owner: user })
          .lean()
          .skip((page - 1) * limit)
          .limit(limit)
      : await picturesModel
          .find()
          .lean()
          .skip((page - 1) * limit)
          .limit(limit);
  let pagesTotal: number =
    filter == 'true'
      ? Math.floor((await picturesModel.find({ owner: user }).count()) / limit) + 1
      : Math.floor((await picturesModel.find().count()) / limit) + 1;
  let response: dbResponse = {
    objects: pictures.map((elem) => elem.path),
    page: page,
    total: pagesTotal,
  };

  return response;
};

function extractUserFromToken(token: string) {
  let user = JWT.verify(token, process.env.TOKEN_KEY);
  return user.email;
}
