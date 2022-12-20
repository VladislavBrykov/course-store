import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { LmsModule } from './lms/lms.module';
import { GraphqlModule } from './lms/graphql/graphql.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GameModule,
    UserModule,
    LmsModule,
    GraphqlModule,
  ],
})
export class MainModule {}
