import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { UploadMessage, UploadErrorMessage, UploadResponse } from './upload.interface';
import { errorHandler } from '@helper/http-api/error-handler';
import { picturesModel } from '@models/MongoDB/picture.model';
import { connectDB } from '@services/db_connection';

const FOLDER_PATH = '../../../../../pictures';
const stat = util.promisify(fs.stat);

export class UploadService {
  private errMsg: UploadErrorMessage;
  private msg: UploadMessage;
  private response: UploadResponse;

  constructor() {
    this.errMsg = { errorMessage: 'Failed to save the file' };
    this.msg = { message: 'The file is saved' };
    this.response = {
      statusCode: 200,
      message: this.msg,
    };
  }

  async saveFile(payload: string | NodeJS.ArrayBufferView, filename: string, user: string): Promise<UploadResponse> {
    try {
      fs.writeFile(path.join(__dirname, `${FOLDER_PATH}/${filename}`), payload, (err: any) => {
        if (err) console.error(err);
      });

      await this.saveFileToDB(filename, user);

      this.response.message = this.msg;
      this.response.statusCode = 200;

      return this.response;
    } catch (err) {
      this.response.message = this.errMsg;
      this.response.statusCode = 500;
      errorHandler(err);
      return this.response;
    }
  }

  async saveFileToDB(filename: string, user: string) {
    await connectDB;
    const metadata = await stat(path.join(__dirname, `${FOLDER_PATH}/${filename}`));

    await picturesModel.create({
      path: filename,
      metadata: metadata,
      owner: user,
    });
  }
}
