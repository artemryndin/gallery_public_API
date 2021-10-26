export interface GalleryRequestParams {
  page: number;
  limit: number;
  filter: string | boolean;
  user: string;
}

export interface GalleryPayload {
  objects: Array<string>;
  page: number;
  total: number;
}

export interface GalleryResponse {
  statusCode: number;
  data: GalleryPayload;
}

export interface UploadMessage {
  message: string;
}

export interface UploadErrorMessage {
  errorMessage: string;
}

export interface UploadResponse {
  statusCode: number;
  message: UploadMessage | UploadErrorMessage;
}
