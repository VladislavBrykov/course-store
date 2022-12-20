import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from '@cms/user/user.service';
import { TokenPayload, UserData } from '@cms/utilities/api-types';
import { AuthService } from '@cms/auth/auth.service';
import { JwtAccessTokenGuard } from '@cms/auth/jwt/jwt-acces-token.guard';
import { JwtRefreshTokenGuard } from '@cms/auth/jwt/jwt-refresh-token.guard';
import { LocalGuard } from '@cms/auth/local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signIn(@Req() request: UserData): Promise<TokenPayload> {
    const { user } = request;
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    await request.res.setHeader('Set-Cookie', [accessToken, refreshToken]);
    return this.userService.getById(user.id);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('sign-out')
  async signOut(@Req() request: Request): Promise<void> {
    request.res.setHeader('Set-Cookie', await this.authService.signOut());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh-token')
  async refresh(@Req() request: UserData): Promise<TokenPayload> {
    const accessToken = await this.authService.generateAccessToken(
      request.user,
    );
    request.res.setHeader('Set-Cookie', accessToken);
    return request.user;
  }
}
