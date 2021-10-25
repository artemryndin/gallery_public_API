export interface SignUpErrorMessage {
  errorMessage: string;
}

export interface SignUpMessage {
  message: string;
}

export interface SignUpResponse {
  statusCode: number;
  message: SignUpErrorMessage | SignUpMessage;
}
