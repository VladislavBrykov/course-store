import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreenWriterRepository } from './screen-writer/screen-writer.repository';
import { StudentRepository } from './student/student.repository';
import { TeacherRepository } from './teacher/teacher.repository';
import { UserService } from './user.service';
import { UserProfileRepository } from './user-profile/user-profile.repository';
import { StudentService } from '@cms/user/student/student.service';
import { UserController } from '@cms/user/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ScreenWriterRepository,
      StudentRepository,
      TeacherRepository,
      UserProfileRepository,
    ]),
  ],
  providers: [UserService, StudentService],
  exports: [UserService, StudentService],
})
export class UserModule {}
