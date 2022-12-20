import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { UserProfileData } from '../utilities/api-types';
import { ScreenWriter } from './screen-writer/screen-writer.entity';
import { ScreenWriterRepository } from './screen-writer/screen-writer.repository';
import { Student } from './student/student.entity';
import { StudentRepository } from './student/student.repository';
import { Teacher } from './teacher/teacher.entity';
import { TeacherRepository } from './teacher/teacher.repository';
import { UserProfile } from './user-profile/user-profile.entity';
import { UserProfileRepository } from './user-profile/user-profile.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserProfileDto,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from '@cms/auth/auth.dto';
import { UserRole } from '@cms/utilities/user-role.enum';
import { StudentService } from '@cms/user/student/student.service';

@Injectable()
export class UserService {
  constructor(
    private screenWriterRepository: ScreenWriterRepository,
    private studentRepository: StudentRepository,
    private teacherRepository: TeacherRepository,
    private userProfileRepository: UserProfileRepository,
    private configService: ConfigService,
    private studentService: StudentService,
  ) {}

  public assertEmailIsNotInUse(
    email: string,
    excludingUserId?: number,
  ): Promise<void> {
    return this.findUserProfileByEmail(email).then((existingUser) => {
      if (existingUser && existingUser.id !== excludingUserId) {
        throw new ForbiddenException(`Email ${email} already exist!`);
      }
    });
  }

  async createUserProfile(
    userProfileData: CreateUserProfileDto,
  ): Promise<UserProfile> {
    await this.assertEmailIsNotInUse(userProfileData.email);
    if (
      userProfileData.role === UserRole.STUDENT &&
      userProfileData.playerName
    ) {
      await this.studentService.assertPlayerNameNotInUse(
        userProfileData.playerName,
      );
    }

    const savedUser = await this.userProfileRepository.createUserProfile({
      name: userProfileData.name,
      email: userProfileData.email,
      passwordHash: await this.hashPassword(userProfileData.password),
      role: userProfileData.role,
    });

    switch (userProfileData.role) {
      case UserRole.SCREEN_WRITER: {
        await this.screenWriterRepository.createScreenWriter(savedUser.id);
        break;
      }
      case UserRole.STUDENT: {
        await this.studentRepository.createStudent(savedUser.id, {
          playerName: userProfileData.playerName,
        });
        break;
      }
      case UserRole.TEACHER: {
        await this.teacherRepository.createTeacher(savedUser.id);
        break;
      }
    }

    return this.userProfileRepository.findUserProfileById(savedUser.id);
  }

  private async hashPassword(password: string): Promise<string> {
    const bcryptSalt = await bcrypt.genSalt(
      Number(this.configService.get('SALT_ROUNDS')),
    );
    return await bcrypt.hash(password, bcryptSalt);
  }

  async findAllUserProfiles(): Promise<UserProfile[]> {
    return this.userProfileRepository.findAllUserProfiles();
  }

  async findUserProfileByEmail(email: string): Promise<UserProfile> {
    return this.userProfileRepository.findUserProfileByEmail(email);
  }

  async signInFindByLogin(email: string): Promise<UserProfile | undefined> {
    return this.userProfileRepository.signInFindByLogin(email);
  }

  async updateUserProfile({
    playerName,
    ...userProfileData
  }: UpdateUserProfileDto): Promise<UserProfile> {
    await this.assertEmailIsNotInUse(userProfileData.email, userProfileData.id);
    if (playerName) {
      await this.studentService.assertPlayerNameNotInUse(
        playerName,
        userProfileData.id,
      );
    }
    await this.studentService.updatePlayerName(userProfileData.id, playerName);
    return this.userProfileRepository.updateUserProfile(userProfileData);
  }

  async deleteUserProfile(userProfileId: number): Promise<DeleteResult> {
    return this.userProfileRepository.deleteUserProfile(userProfileId);
  }

  async updatePassword({
    id,
    password,
  }: UpdateUserPasswordDto): Promise<UserProfile> {
    const existingUser = await this.userProfileRepository
      .findOneOrFail({ id })
      .catch(() => {
        throw new NotFoundException('User not found');
      });

    existingUser.passwordHash = await this.hashPassword(password);
    return this.userProfileRepository.save(existingUser);
  }

  async getById(id): Promise<UserProfile> {
    return this.userProfileRepository.findOneOrFail({ id }).catch(() => {
      throw new NotFoundException('User not found');
    });
  }
}
