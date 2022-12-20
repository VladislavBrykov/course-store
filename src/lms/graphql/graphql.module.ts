import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphqlService } from '@cms/lms/graphql/graphql.service';

@Module({
  controllers: [],
  imports: [ConfigModule, TypeOrmModule.forFeature([])],
  providers: [GraphqlService],
  exports: [GraphqlService],
})
export class GraphqlModule {}
