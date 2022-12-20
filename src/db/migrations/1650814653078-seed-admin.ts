import * as bcrypt from 'bcrypt';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import { UserProfile } from '@cms/user/user-profile/user-profile.entity';
import { UserRole } from '@cms/utilities/user-role.enum';

export class SeedAdmin1650814653078 implements MigrationInterface {
  private readonly userRepo = getRepository(UserProfile);

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createAdmin();
    await this.createTestStudent();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropTestStudent();
    await this.dropAdmin();
  }

  private async createAdmin(): Promise<void> {
    const salt = await bcrypt.genSalt(Number(process.env['SALT_ROUNDS']));
    const passwordHash = await bcrypt.hash(process.env['ADMIN_PASSWORD'], salt);
    await this.userRepo.save({
      role: UserRole.ADMIN,
      email: process.env['ADMIN_EMAIL'],
      name: 'admin',
      passwordHash,
    });
  }

  private async dropAdmin(): Promise<void> {
    await this.userRepo.delete({
      email: process.env['ADMIN_EMAIL'],
    });
  }

  private async createTestStudent(): Promise<void> {
    const salt = await bcrypt.genSalt(Number(process.env['SALT_ROUNDS']));
    const passwordHash = await bcrypt.hash(
      process.env.TEST_STUDENT_PASSWORD,
      salt,
    );
    await this.userRepo.save({
      role: UserRole.STUDENT,
      email: process.env.TEST_STUDENT_EMAIL,
      name: 'student',
      passwordHash,
      student: {
        isTest: true,
        playerName: 'test1',
      },
    });
  }

  private async dropTestStudent(): Promise<void> {
    await this.userRepo.delete({ email: 'foo@bar.baz' });
  }
}
