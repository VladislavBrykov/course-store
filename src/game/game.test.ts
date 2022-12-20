import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { getRepository, In, Not, Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '@cms/auth/auth.module';
import { DatabaseModule } from '@cms/database.module';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { Text } from '@cms/game/text/text.entity';
import { CodewordClue } from '@cms/game/codeword-clue/codeword-clue.entity';
import { GameModule } from '@cms/game/game.module';
import { CreateEpisodeDto } from '@cms/game/episode/episode.dto';
import { Lang } from '@cms/utilities/lang.enum';
import {
  AddStageDto,
  UpdateStageDto,
} from '@cms/game/episode-stage/episode-stage.dto';
import { Trait } from '@cms/utilities/trait.enum';
import { UpdateClueDto } from '@cms/game/codeword-clue/codeword-clue.dto';
import { UpdateTextDto } from '@cms/game/text/text.dto';
import { UserRole } from '@cms/utilities/user-role.enum';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { AnswerValidator } from '@cms/game/answer-validator/answer-validator.entity';

describe('Game', () => {
  let userRepo: Repository<UserProfile>;
  let epRepo: Repository<Episode>;
  let stgRepo: Repository<EpisodeStage>;
  let textRepo: Repository<Text>;
  let clueRepo: Repository<CodewordClue>;
  let episodeStateRepo: Repository<EpisodeState>;
  let validatorRepo: Repository<AnswerValidator>;

  let app: INestApplication;

  let defaultEpIds: number[];
  let testEpId: number;

  beforeAll(async () => {
    {
      app = await Test.createTestingModule({
        imports: [ConfigModule, AuthModule, DatabaseModule, GameModule],
      })
        .compile()
        .then((ref) => ref.createNestApplication());
      app.use(cookieParser());
      await app.init();
    }

    {
      userRepo = getRepository(UserProfile);
      epRepo = getRepository(Episode);
      stgRepo = getRepository(EpisodeStage);
      textRepo = getRepository(Text);
      clueRepo = getRepository(CodewordClue);
      episodeStateRepo = getRepository(EpisodeState);
      validatorRepo = getRepository(AnswerValidator);
    }

    {
      defaultEpIds = await epRepo
        .find({ select: ['id'] })
        .then((eps) => eps.map(({ id }) => id));
      testEpId = defaultEpIds[0];
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Episode management', () => {
    let token: string;

    beforeAll(async () => {
      const testUser = await userRepo.findOneOrFail({ role: UserRole.ADMIN });
      token = new JwtService().sign(
        { id: testUser.id, role: testUser.role },
        {
          secret: process.env['JWT_ACCESS_TOKEN_SECRET'],
          expiresIn: `10d`,
        },
      );
    });

    afterEach(async () => {
      await epRepo.delete({ id: Not(In(defaultEpIds)) });
    });

    it('/episode-remove-management/get-episodes', async () => {
      const res = await request(app.getHttpServer())
        .get('/episode-remove-management/get-episodes')
        .set('Cookie', [`AccessToken=${token}`]);

      expect(res.body).toStrictEqual(
        defaultEpIds.map((id) => expect.objectContaining({ id })),
      );
    });

    it('/episode-remove-management/create-episode-remove', async () => {
      const epData: CreateEpisodeDto = {
        name: 'test episode',
        lang: Lang.ENG,
        codeword: 'test codeword',
        storyStages: ['foo'],
        question: 'foo?',
        validator: "a => a === 'fooo'",
        success: 'fooo!',
        errorStages: ['not foo'],
        clues: ['f', 'o', 'o'],
      };

      const res = await request(app.getHttpServer())
        .post('/episode-remove-management/create-episode-remove')
        .set('Cookie', [`AccessToken=${token}`])
        .send(epData);

      expect(res.body.name).toStrictEqual(epData.name);
      expect(res.body.codeword).toStrictEqual(epData.codeword);

      const epInDb = await epRepo.findOne({ id: res.body.id });

      expect(epInDb).toBeDefined();

      await epRepo.delete({ id: res.body.id });
    });

    it('/episode-remove-management/add-stage', async () => {
      const data: AddStageDto = {
        episodeId: testEpId,
        trait: Trait.INFO,
        text: 'test text',
      };

      const testEpStageIdsSet = await stgRepo
        .find({
          where: { episode: { id: testEpId } },
        })
        .then((stages) => new Set(stages.map(({ id }) => id)));

      const res = await request(app.getHttpServer())
        .post('/episode-remove-management/add-stage')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      const newStage = res.body.episodeStages.find(
        ({ id }) => !testEpStageIdsSet.has(id),
      );

      expect(newStage.trait).toStrictEqual(data.trait);
      expect(
        newStage.content.texts.find(({ lang }) => lang === Lang.ENG).text,
      ).toStrictEqual(data.text);

      const newStageFromDb = await stgRepo.findOne({ id: newStage.id });

      expect(newStageFromDb).toBeDefined();

      await stgRepo.delete({ id: newStage.id });
    });

    it('/episode-remove-management/update-stage', async () => {
      const testEpStages = await stgRepo.find({
        where: { episode: { id: testEpId } },
      });

      const testStage = testEpStages[0];

      const data: UpdateStageDto = {
        id: testStage.id,
        nextStageId: testStage.nextStage?.id,
        rollbackStageId: testStage.rollbackStage?.id,
      };

      const res = await request(app.getHttpServer())
        .patch('/episode-remove-management/update-stage')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      const updatedStage = res.body.episodeStages.find(
        ({ id }) => id === testStage.id,
      );

      expect(new Date(updatedStage.updatedAt).getTime()).not.toStrictEqual(
        testStage.updatedAt.getTime(),
      );
    });

    it('/episode-remove-management/update-clue', async () => {
      const testClue = await stgRepo
        .find({
          where: { episode: { id: testEpId } },
          relations: ['content', 'content.codewordClues'],
        })
        .then((stages) => stages.find(({ trait }) => trait === Trait.CLUE))
        .then(
          ({
            content: {
              codewordClues: [clue],
            },
          }) => clue,
        );

      const data: UpdateClueDto = {
        id: testClue.id,
        clue: `${testClue.clue}_foo_test_postfix`,
      };

      const res = await request(app.getHttpServer())
        .patch('/episode-remove-management/update-clue')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      const clueFromDb = await clueRepo.findOne({ id: testClue.id });

      expect(clueFromDb.clue).toStrictEqual(data.clue);
      expect(res.status).toStrictEqual(200);

      clueFromDb.clue = testClue.clue;

      await clueRepo.save(clueFromDb);
    });

    it('/episode-remove-management/update-text', async () => {
      const testText = await stgRepo
        .find({
          where: { episode: { id: testEpId } },
          relations: ['content', 'content.texts'],
        })
        .then((stages) => stages.find(({ trait }) => trait === Trait.INFO))
        .then(
          ({
            content: {
              texts: [text],
            },
          }) => text,
        );

      const data: UpdateTextDto = {
        id: testText.id,
        text: `${testText.text}_foo_test_postfix`,
      };

      const res = await request(app.getHttpServer())
        .patch('/episode-remove-management/update-text')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      const textFromDb = await textRepo.findOne({ id: testText.id });

      expect(textFromDb.text).toStrictEqual(data.text);
      expect(res.status).toStrictEqual(200);

      textFromDb.text = testText.text;

      await textRepo.save(textFromDb);
    });
  });

  describe('Gameplay', () => {
    let token: string;
    let testEp: Episode;
    let testUser: UserProfile;

    const setEp = async () => {
      await request(app.getHttpServer())
        .post('/game/set-episode-remove')
        .set('Cookie', [`AccessToken=${token}`])
        .send({ codeword: testEp.codeword });
      const state = await episodeStateRepo.findOne({
        where: { student: { id: testUser.student.id } },
        relations: ['student', 'episode'],
      });
      return state.id;
    };

    beforeAll(async () => {
      testUser = await userRepo.findOneOrFail({
        where: { role: UserRole.STUDENT },
        relations: ['student'],
      });
      token = new JwtService().sign(
        { id: testUser.id, role: testUser.role },
        {
          secret: process.env['JWT_ACCESS_TOKEN_SECRET'],
          expiresIn: `10d`,
        },
      );

      testEp = await epRepo.findOne({
        where: {
          id: testEpId,
        },
        relations: ['answerValidators'],
      });
    });

    afterEach(async () => {
      await episodeStateRepo.delete({});
    });

    it('/game/set-episode-remove', async () => {
      const data = {
        codeword: testEp.codeword,
      };

      const res = await request(app.getHttpServer())
        .post('/game/set-episode-remove')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      expect(res.status).toStrictEqual(201);

      const state = await episodeStateRepo.findOne({
        where: { student: { id: testUser.student.id } },
        relations: ['student', 'episode'],
      });

      expect(state.episode.id).toStrictEqual(testEp.id);
    });

    it('/game/next', async () => {
      const data = {
        stateId: await setEp(),
      };

      const res = await request(app.getHttpServer())
        .post('/game/next')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      expect(res.status).toStrictEqual(201);

      const state = await episodeStateRepo.findOne({
        where: { id: data.stateId },
        relations: ['episodeStage'],
      });

      expect(state.episodeStage.isEntryPoint).toStrictEqual(true);
    });

    it('/game/start-episode-remove-story', async () => {
      const data = {
        stateId: await setEp(),
      };

      const res = await request(app.getHttpServer())
        .post('/game/start-episode-remove-story')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      expect(res.status).toStrictEqual(201);

      const state = await episodeStateRepo.findOne({
        where: { id: data.stateId },
        relations: ['episodeStage', 'episodeStage.previousStages'],
      });

      expect(state.episodeStage.isEntryPoint).toStrictEqual(true);
      expect(state.episodeStage.trait).toStrictEqual(Trait.INFO);
      expect(state.episodeStage.previousStages).toHaveLength(0);
    });

    it('/game/show-challenge', async () => {
      const data = {
        stateId: await setEp(),
      };

      const res = await request(app.getHttpServer())
        .post('/game/show-challenge')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      expect(res.status).toStrictEqual(201);

      const state = await episodeStateRepo.findOne({
        where: { id: data.stateId },
        relations: ['episodeStage'],
      });

      const challenge = await stgRepo.findOne({
        episode: { id: testEp.id },
        trait: Trait.CHALLENGE,
      });

      expect(state.episodeStage.id).toStrictEqual(challenge.id);
    });

    it('/game/answer', async () => {
      const oldValidator = testEp.answerValidators[0];

      const validAnswer = 'FooBarBaz';

      const newValidator = `a => a === '${validAnswer}'`;

      await validatorRepo.save({
        ...oldValidator,
        validatorFunction: newValidator,
      });

      const data = {
        stateId: await setEp(),
        answer: validAnswer,
      };

      const res = await request(app.getHttpServer())
        .post('/game/answer')
        .set('Cookie', [`AccessToken=${token}`])
        .send(data);

      expect(res.status).toStrictEqual(201);

      const state = await episodeStateRepo.findOne({
        where: { id: data.stateId },
        relations: ['episodeStage'],
      });

      expect(state.episodeStage.trait).toStrictEqual(Trait.SUCCESS);

      await validatorRepo.save(oldValidator);
    });
  });
});
