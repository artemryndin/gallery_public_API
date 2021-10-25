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
