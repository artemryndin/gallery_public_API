import { UploadResponse } from './upload.interface';
import { UploadService } from './upload.service';

export class UploadManager {
  private readonly service: UploadService;

  constructor() {
    this.service = new UploadService();
  }

  async uploadPicture(
    payload: string | NodeJS.ArrayBufferView,
    filename: string,
    user: string
  ): Promise<UploadResponse> {
    return await this.service.saveFile(payload, filename, user);
  }
}
