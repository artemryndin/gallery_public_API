import * as crypto from 'crypto';
import { errorHandler } from '@helper/http-api/error-handler';
import { Response } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { UsersModel } from '@models/MongoDB/db_user_schema';
import { connectDB } from '@helper/db_connection';
import * as JWT from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const signUp: APIGatewayProxyHandlerV2 = async (event) => {
  log(event);
  await connectDB();

  let response = new Response({
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });

  try {
    console.log(`Event body: ${event.body}`);
    if (event.body) {
      let body = JSON.parse(event.body);
      console.log(`Event body email: ${body.email}\nEvent body password: ${body.password}`);

      if (await UsersModel.exists({ email: body.email })) {
        return response.create(403, { errorMessage: 'User alredy exists' });
      } else {
        let pw = crypto
          .createHmac('sha256', process.env.PASSWORD_ENC_KEY ?? 'key')
          .update(body.password)
          .digest('hex');
        await UsersModel.create({ email: body.email, passwordHash: pw });
        return response.create(200, { message: 'User created. You can log in now' });
      }
    } else return response.create(400, { errorMessage: 'Request body is empty' });
  } catch (error) {
    return errorHandler(error, response);
  }
};
