import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as bcrypt from 'bcrypt';
import { getRepository, In, Not, Repository } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@cms/user/user.module';
import { DatabaseModule } from '@cms/database.module';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';
import { AuthModule } from '@cms/auth/auth.module';
import { Student } from '@cms/user/student/student.entity';
import { UserRole } from '@cms/utilities/user-role.enum';

describe('User', () => {
  let userRepo: Repository<UserProfile>;
  let studentRepo: Repository<Student>;

  let app: INestApplication;
  let token: string;

  const admUserId = 1;
  const studentUserId = 2;
  const studentId = 1;

  beforeAll(async () => {
    {
      app = await Test.createTestingModule({
        imports: [ConfigModule, AuthModule, DatabaseModule, UserModule],
      })
        .compile()
        .then((ref) => ref.createNestApplication());
      app.use(cookieParser());
      await app.init();
    }

    {
      userRepo = getRepository(UserProfile);
      studentRepo = getRepository(Student);
    }

    {
      const testUser = await userRepo.findOneOrFail({ id: 1 });
      token = new JwtService().sign(
        { id: testUser.id, role: testUser.role },
        {
          secret: process.env['JWT_ACCESS_TOKEN_SECRET'],
          expiresIn: `10d`,
        },
      );
    }
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await studentRepo.delete({ id: Not(studentId) });
    await userRepo.delete({ id: Not(In([studentUserId, admUserId])) });
  });

  it('/user-profile/find-all-user-profiles', async () => {
    const res = await request(app.getHttpServer())
      .get('/user-profile/find-all-user-profiles')
      .set('Cookie', [`AccessToken=${token}`]);

    const usersCount = await userRepo.count({});

    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: admUserId }),
        expect.objectContaining({
          id: studentUserId,
          student: expect.objectContaining({ id: studentId }),
        }),
      ]),
    );
    expect(res.body.length).toStrictEqual(usersCount);
  });

  it('/user-profile/create-user-profile', async () => {
    const userData = {
      password: 'foo_bar_baz',
      role: UserRole.ADMIN,
      name: 'foo@foo.foo',
      email: 'foo@foo.foo',
    };

    const res = await request(app.getHttpServer())
      .post('/user-profile/create-user-profile')
      .set('Cookie', [`AccessToken=${token}`])
      .send(userData);

    const usr = await userRepo.findOne({ id: res.body.id });

    expect(res.status).toStrictEqual(201);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        role: userData.role,
        name: userData.name,
        email: userData.email,
      }),
    );
    expect(usr).toBeDefined();
  });

  it('/user-profile/delete-user-profile', async () => {
    const userData = {
      password: 'foo_bar_baz',
      role: UserRole.ADMIN,
      name: 'foo@foo.foo',
      email: 'foo@foo.foo',
    };

    const creationResponse = await request(app.getHttpServer())
      .post('/user-profile/create-user-profile')
      .set('Cookie', [`AccessToken=${token}`])
      .send(userData);

    const createdUser = await userRepo.findOne({
      id: creationResponse.body.id,
    });

    expect(creationResponse.status).toStrictEqual(201);
    expect(createdUser).toBeDefined();

    const deletingResponse = await request(app.getHttpServer())
      .delete(
        `/user-profile/delete-user-profile?userProfileId=${creationResponse.body.id}`,
      )
      .set('Cookie', [`AccessToken=${token}`])
      .send(userData);

    const currentlyNotExistingUser = await userRepo.findOne({
      id: creationResponse.body.id,
    });

    expect(deletingResponse.status).toStrictEqual(200);
    expect(currentlyNotExistingUser).not.toBeDefined();
  });

  it('/user-profile/update-password', async () => {
    const testUserId = studentId;
    const testPassword = 'NEW_TEST_PASSWORD';

    const { passwordHash: oldHash } = await userRepo.findOne({
      where: { id: testUserId },
      select: ['passwordHash'],
    });

    await request(app.getHttpServer())
      .put('/user-profile/update-password')
      .set('Cookie', [`AccessToken=${token}`])
      .send({ id: testUserId, password: testPassword });

    const { passwordHash: newHash } = await userRepo.findOne({
      where: { id: testUserId },
      select: ['passwordHash'],
    });

    const isPasswordValid = await bcrypt.compare(testPassword, newHash);

    expect(isPasswordValid).toStrictEqual(true);

    await userRepo.save({ id: testUserId, passwordHash: oldHash });
  });
});
