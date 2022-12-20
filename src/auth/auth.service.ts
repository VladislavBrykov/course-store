import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '@cms/user/user.service';
import { TokenPayload } from '@cms/utilities/api-types';
import { SignInDto } from '@cms/auth/auth.dto';

enum TokenType {
  ACCESS = 'AccessToken',
  REFRESH = 'RefreshToken',
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(signInData: SignInDto): Promise<TokenPayload> {
    const user = await this.userService.signInFindByLogin(signInData.login);
    if (!user) {
      throw new UnauthorizedException('Wrong login or password!');
    }
    const passwordIsValid = await bcrypt.compare(
      signInData.password,
      user.passwordHash,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Wrong login or password!');
    }
    return {
      id: user.id,
      role: user.role,
    };
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    const maxAge = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${maxAge}s`,
    });
    return this.tokenCookieString(TokenType.ACCESS, token, maxAge);
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    const maxAge = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${maxAge}s`,
    });
    return this.tokenCookieString(TokenType.REFRESH, token, maxAge);
  }

  async signOut(): Promise<string[]> {
    return [
      this.tokenCookieString(TokenType.ACCESS),
      this.tokenCookieString(TokenType.REFRESH),
    ];
  }

  private tokenCookieString(type: TokenType, token = '', maxAge = 0): string {
    return `${type}=${token}; HttpOnly; SameSite=None; Secure=true; Path=/; Max-Age=${maxAge}`;
  }
}
