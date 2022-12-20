import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import * as dbConfig from '@ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = {
          type: 'postgres',
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          host: configService.get('POSTGRES_HOST'),
          extra: {
            host: configService.get('POSTGRES_HOST'),
          },
          synchronize: false,
        } as any;

        if (configService.get('NODE_ENV') !== 'test') {
          config.autoLoadEntities = true;
        } else {
          config.entities = ['./src/**/*.entity.ts'];
        }
        return config;
      },
    }),
  ],
})
export class DatabaseModule {}
