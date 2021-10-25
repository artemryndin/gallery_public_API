import { getEnv } from '@helper/environment';
import * as jwt from 'jsonwebtoken';

export class LoginService {
  signJWTToken(userEmail: string) {
    return jwt.sign({ email: userEmail }, getEnv('TOKEN_KEY'));
  }
}
