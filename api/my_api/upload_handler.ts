import { errorHandler } from '@helper/http-api/error-handler';
import { Response } from '@helper/http-api/response';
import * as JWT from 'jsonwebtoken';
import * as parser from 'lambda-multipart-parser';
import { picturesModel } from '@models/MongoDB/db_picture_schema';
import { connectDB } from '@helper/db_connection';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { config } from 'dotenv';
config();

const stat = util.promisify(fs.stat);

export const uploadPicture = async (event) => {
  let response = new Response();

  try {
    await connectDB();

    let file = await parser.parse(event);
    await fs.writeFile(
      path.join(__dirname, `../../../../pictures/${file.files[0].filename}`),
      file.files[0].content,
      (err: any) => {
        if (err) console.error(err);
      }
    );

    let fileMetadata = await stat(path.join(__dirname, `../../../../pictures/${file.files[0].filename}`));
    //@ts-ignore
    let user = event.requestContext.authorizer.claims;

    let image = new picturesModel({
      path: file.files[0].filename,
      metadata: fileMetadata,
      owner: user,
    });

    await image.save();
    return response.create(200, { message: 'File upload complete' });
  } catch (error) {
    return errorHandler(error, response);
  }
};

function extractUserFromToken(token: string) {
  let user = JWT.verify(token, process.env.TOKEN_KEY);
  return user.email;
}
