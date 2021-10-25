import { SignUpService } from './sign_up.service';
import { UserCredentials } from '@interfaces/user-credentials.interface';
import { HttpBadRequestError } from '@errors/http';
import { SignUpResponse } from './sign_up.interface';

export class SignUpManager {
  private readonly service: SignUpService;
  constructor() {
    this.service = new SignUpService();
  }

  async signUp(credentials: UserCredentials, service: SignUpService): Promise<SignUpResponse> {
    if (!credentials) {
      throw new HttpBadRequestError('Credentials not provided');
    }

    return await this.service.signUp(credentials);
  }
}
