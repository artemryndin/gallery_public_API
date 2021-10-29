interface JWTToken {
  token: string;
}

interface ErrorMessage {
  errorMessage: string;
}

export interface AuthenticationResponse {
  statusCode: number;
  content: JWTToken | ErrorMessage;
}

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
