import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import {
  CreateUserProfileDto,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from '@cms/auth/auth.dto';
import { JwtAccessTokenGuard } from '@cms/auth/jwt/jwt-acces-token.guard';
import { Role } from '@cms/auth/role/role.decorator';
import { RoleGuard } from '@cms/auth/role/role.guard';
import { UserRole } from '@cms/utilities/user-role.enum';
import { UserService } from '@cms/user/user.service';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';

@Controller('user-profile')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  @Get('find-all-user-profiles')
  async findAllUserProfiles(): Promise<UserProfile[]> {
    return this.userService.findAllUserProfiles();
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  @Put('update-user-profile')
  async updateUserProfile(
    @Body() userProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    return this.userService.updateUserProfile(userProfileDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  @Post('create-user-profile')
  async createUser(
    @Body() userProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    return this.userService.createUserProfile(userProfileDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  @Delete('delete-user-profile')
  async deleteUserProfile(
    @Query('userProfileId') userProfileId: number,
  ): Promise<DeleteResult> {
    return this.userService.deleteUserProfile(userProfileId);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  @Put('update-password')
  async updatePassword(
    @Body() userProfileDto: UpdateUserPasswordDto,
  ): Promise<UserProfile> {
    return this.userService.updatePassword(userProfileDto);
  }
}
