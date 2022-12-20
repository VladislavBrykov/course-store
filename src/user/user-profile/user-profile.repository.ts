import { NotFoundException } from '@nestjs/common';
import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from 'typeorm';

import { UserProfileData } from '@cms/utilities/api-types';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';
import { UpdateUserProfileDto } from '@cms/auth/auth.dto';

@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {
  async createUserProfile(
    userProfileData: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const userProfile = await this.create(userProfileData);
    return this.save(userProfile);
  }

  async findAllUserProfiles(): Promise<UserProfile[]> {
    return this.find({ relations: ['student'] });
  }

  async findUserProfileById(userProfileId: number): Promise<UserProfile> {
    const userProfile = await this.findOne({
      where: {
        id: userProfileId,
      },
      relations: ['student'],
    });
    if (!userProfile) {
      throw new NotFoundException('User profile not found!');
    }
    return userProfile;
  }

  async findUserProfileByEmail(
    email: string,
  ): Promise<UserProfile | undefined> {
    return this.findOne({ email });
  }

  async signInFindByLogin(login: string): Promise<UserProfile | undefined> {
    return this.findOne({
      where: [{ email: login }, { student: { playerName: login } }],
      select: ['id', 'role', 'passwordHash'],
      relations: ['student'],
    });
  }

  async updateUserProfile(
    userProfileData: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const userProfile = await this.findUserProfileById(userProfileData.id);
    userProfile.email = userProfileData.email;
    userProfile.name = userProfileData.name;
    return this.save(userProfile);
  }

  async deleteUserProfile(userProfileId: number): Promise<DeleteResult> {
    const userProfile = await this.findUserProfileById(userProfileId);
    return this.delete(userProfile.id);
  }
}
