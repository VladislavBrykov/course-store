import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EpisodeRepository } from '@cms/game/episode/episode.repository';
import { EpisodeStateService } from '@cms/game/episode-state/episode-state.service';
import { Trait } from '@cms/utilities/trait.enum';
import { Episode } from '@cms/game/episode/episode.entity';
import {
  CreateEpisodeDto,
  UpdateEpisodeDto,
} from '@cms/game/episode/episode.dto';
import { ContentTypeEnum } from '@cms/utilities/content-type.enum';
import { EpisodeStageRepository } from '@cms/game/episode-stage/episode-stage.repository';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { DeepPartial } from 'typeorm';
import { StudentRepository } from '@cms/user/student/student.repository';

@Injectable()
export class EpisodeService {
  constructor(
    private episodeRepo: EpisodeRepository,
    private episodeStateService: EpisodeStateService,
    private stageRepo: EpisodeStageRepository,
    private studentRepo: StudentRepository,
  ) {}

  public async setEpisode(codeword: string, userId: number): Promise<number> {
    const isTestStudent = await this.studentRepo.isTestStudentByUserId(userId);

    const ep = await this.episodeRepo
      .findPublishedByCodeword(codeword, isTestStudent)
      .catch(() => {
        throw new NotFoundException('Episode not found');
      });

    return this.episodeStateService
      .getOrCreateByEpisodeAndStudentUserId(ep, userId)
      .then(({ id }) => id);
  }

  public getPopulatedEpisodes(): Promise<Episode[]> {
    return this.episodeRepo.getPopulatedEpisodes();
  }

  public getPopulatedEpisode(epId: number): Promise<Episode> {
    return this.episodeRepo.getPopulatedEpisode(epId);
  }

  public async createEpisode(newEpisode: CreateEpisodeDto): Promise<Episode> {
    if (newEpisode.storyStages.length < 1) {
      throw new BadRequestException(
        'Episode requires at least one story stage',
      );
    }

    if (newEpisode.errorStages.length < 1) {
      throw new BadRequestException(
        'Episode requires at least one error stage',
      );
    }

    if (newEpisode.clues.length < 1) {
      throw new BadRequestException('Episode requires at least one clue');
    }

    await this.assertCodewordNotInUse(newEpisode.codeword);
    await this.assertNameNotInUse(newEpisode.name);

    const [firstStoryStage, ...otherStoryStages] = newEpisode.storyStages;

    const episode = await this.episodeRepo.save({
      codeword: newEpisode.codeword,
      name: newEpisode.name,
      published: false,
      episodeStages: [
        {
          isEntryPoint: true,
          trait: Trait.INFO,
          content: {
            contentType: ContentTypeEnum.TEXT,
            texts: [
              {
                text: firstStoryStage,
              },
            ],
          },
        },
      ],
      answerValidators: [
        {
          validatorFunction: newEpisode.validator,
        },
      ],
    });

    let lastStage: EpisodeStage = episode.episodeStages[0];

    for (const newStoryStage of otherStoryStages) {
      const [existingStoryStage] = await this.stageRepo.find({
        where: {
          episode: { id: episode.id },
          trait: Trait.INFO,
        },
        order: { id: 'DESC' },
        take: 1,
      });

      lastStage = await this.stageRepo.save({
        trait: Trait.INFO,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: newStoryStage }],
        },
        episode: { id: episode.id },
        previousStages: [{ id: existingStoryStage.id }],
      });
    }

    const question = await this.stageRepo.save({
      trait: Trait.CHALLENGE,
      content: {
        contentType: ContentTypeEnum.TEXT,
        texts: [{ text: newEpisode.question }],
      },
      episode: { id: episode.id },
      previousStages: [{ id: lastStage.id }],
    });

    const success = await this.stageRepo.save({
      trait: Trait.SUCCESS,
      content: {
        contentType: ContentTypeEnum.TEXT,
        texts: [{ text: newEpisode.success }],
      },
      episode: { id: episode.id },
      previousStages: [{ id: question.id }],
    });

    let lastErrorOrQuestion: EpisodeStage = question;

    for (const newErrorStage of newEpisode.errorStages) {
      const data: DeepPartial<EpisodeStage> = {
        trait: Trait.ERROR,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: newErrorStage }],
        },
        episode: { id: episode.id },
        rollbackStage: { id: success.id },
      };

      if (lastErrorOrQuestion.trait === Trait.ERROR) {
        data.previousStages = [{ id: lastErrorOrQuestion.id }];
      } else {
        data.rollbackFrom = [{ id: lastErrorOrQuestion.id }];
      }

      lastErrorOrQuestion = await this.stageRepo.save(data);
    }

    lastErrorOrQuestion.nextStage = lastErrorOrQuestion;
    await this.stageRepo.save(lastErrorOrQuestion);
    // clues
    const clue = await this.stageRepo.save({
      trait: Trait.CLUE,
      content: {
        contentType: ContentTypeEnum.CODEWORD_CLUE,
        codewordClues: newEpisode.clues.map((clue) => ({ clue })),
      },
      previousStages: [{ id: success.id }],
      episode: { id: episode.id },
    });

    clue.previousStages.push(clue);
    await this.stageRepo.save(clue);

    return this.episodeRepo.getPopulatedEpisode(episode.id);
  }

  public async updateEpisode(data: UpdateEpisodeDto): Promise<Episode> {
    await this.assertEpisodeExists(data.id);
    await this.assertCodewordNotInUse(data.codeword, data.id);
    await this.assertNameNotInUse(data.name, data.id);

    const existingEp = await this.episodeRepo.findOne({
      where: {
        id: data.id,
      },
      relations: ['answerValidators'],
    });

    existingEp.isPublished = data.isPublished;
    existingEp.codeword = data.codeword;
    if (existingEp.answerValidators.length > 0) {
      existingEp.answerValidators[0].validatorFunction = data.validator;
    }

    await this.episodeRepo.save(existingEp);

    return this.episodeRepo.getPopulatedEpisode(existingEp.id);
  }

  public assertEpisodeExists(id: number): Promise<void> {
    return this.episodeRepo.findOne(id).then((ep) => {
      if (!ep) throw new NotFoundException('Episode not found');
    });
  }

  public assertCodewordNotInUse(
    codeword: string,
    excludeEpId?: number,
  ): Promise<void> {
    return this.episodeRepo.findOne({ where: { codeword } }).then((ep) => {
      if (ep && excludeEpId !== ep.id) {
        throw new ForbiddenException('Codeword already in use');
      }
    });
  }

  public assertNameNotInUse(name: string, excludeEpId?: number): Promise<void> {
    return this.episodeRepo.findOne({ where: { name } }).then((ep) => {
      if (ep && excludeEpId !== ep.id) {
        throw new ForbiddenException('Codeword already in use');
      }
    });
  }
}
