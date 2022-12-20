import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { TokenPayload } from '@cms/utilities/api-types';
import { AuthService } from '@cms/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
    });
  }
  async validate(login: string, password: string): Promise<TokenPayload> {
    return this.authService.signIn({ login, password });
  }
}
