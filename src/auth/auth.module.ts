import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from './../user/user.module';
import { AuthController } from '@cms/auth/auth.controller';
import { AuthService } from '@cms/auth/auth.service';
import { JwtAccessTokenStrategy } from '@cms/auth/jwt/jwt-acces-token.strategy';
import { JwtRefreshTokenStrategy } from '@cms/auth/jwt/jwt-refresh-token.strategy';
import { LocalStrategy } from '@cms/auth/local/local.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, JwtModule.register({}), PassportModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
