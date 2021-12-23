interface JWTToken {
  token: string;
}

interface ErrorMessage {
  errorMessage: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface SignUpErrorMessage {
  errorMessage: string;
}

export interface SignUpMessage {
  message: string;
}

export interface SignUpResponse {
  info: SignUpErrorMessage | SignUpMessage;
}
