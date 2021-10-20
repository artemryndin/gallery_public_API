import { errorHandler } from '@helper/http-api/error-handler';
import * as crypto from 'crypto';
import { Response } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { UsersModel } from '@models/MongoDB/db_user_schema';
import { connectDB } from '@helper/db_connection';
import { config } from 'dotenv';
import * as JWT from 'jsonwebtoken';
config();

export const loginGetResponse: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);

  let response = new Response({
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });

  try {
    return response.create(200, { message: 'Request succeeded' });
  } catch (error) {
    return errorHandler(error, response);
  }
};

export const loginPostResponse: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);
  await connectDB();

  try {
    let response = new Response({
      'Access-Control-Allow_Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    if (event.body && process.env.PASSWORD_ENC_KEY) {
      let eventBody = JSON.parse(event.body);
      if (eventBody.email && eventBody.password) {
        let user = await UsersModel.findOne({ email: eventBody.email });
        let eventPwEnc = crypto
          .createHmac('sha256', process.env.PASSWORD_ENC_KEY)
          .update(eventBody.password)
          .digest('hex');

        if (eventPwEnc === user.passwordHash) {
          let JWTtoken = JWT.sign({ user: eventBody.email }, process.env.TOKEN_KEY);
          return response.create(200, { token: JWTtoken });
        } else return response.create(400, { errorMessage: 'Invalid email or password' });
      } else return response.create(400, { errorMessage: 'Credentials not provided' });
    } else return response.create(400, { errorMessage: 'Empty request body' });
  } catch (error) {
    return errorHandler(error);
  }
};
