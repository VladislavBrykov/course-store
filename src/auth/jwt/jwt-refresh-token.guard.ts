import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info, context, status) {
    if (info) {
      throw new UnauthorizedException(`${info}`);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
