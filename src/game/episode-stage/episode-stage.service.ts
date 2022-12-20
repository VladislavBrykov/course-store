import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { _ } from '@cms/utilities/lodash';
import { Trait } from '@cms/utilities/trait.enum';
import { StudentService } from '@cms/user/student/student.service';
import { EpisodeStateService } from '@cms/game/episode-state/episode-state.service';
import { EpisodeStageRepository } from '@cms/game/episode-stage/episode-stage.repository';
import { ContentService } from '@cms/game/content/content.service';
import { CodewordClueService } from '@cms/game/codeword-clue/codeword-clue.service';
import { AnswerValidatorService } from '@cms/game/answer-validator/answer-validator.service';
import {
  AddStageDto,
  UpdateStageDto,
} from '@cms/game/episode-stage/episode-stage.dto';
import { EpisodeService } from '@cms/game/episode/episode.service';
import { Content } from '@cms/game/content/content.entity';
import { Text } from '@cms/game/text/text.entity';
import { CodewordClue } from '@cms/game/codeword-clue/codeword-clue.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { ContentTypeEnum } from '@cms/utilities/content-type.enum';

@Injectable()
export class EpisodeStageService {
  constructor(
    private episodeStageRepo: EpisodeStageRepository,
    private studentService: StudentService,
    private episodeStateService: EpisodeStateService,
    private contentService: ContentService,
    private clueService: CodewordClueService,
    private answerValidatorService: AnswerValidatorService,
    private episodeService: EpisodeService,
  ) {}

  public async nextStage(
    userId: number,
    stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    const student = await this.studentService.getByUserId(userId);
    const state = await this.episodeStateService.getByIdAndStudent(
      stateId,
      student,
    );
    const stage = await this.nextByState(state);
    const content = await this.contentService.getByStage(stage);
    return {
      trait: stage.trait,
      text:
        _.first(content.texts)?.text ??
        (await this.clueService.selectRandomClue(content.codewordClues, state))
          ?.clue ??
        '',
    };
  }

  public async startTheStory(
    userId: number,
    stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    const student = await this.studentService.getByUserId(userId);
    const state = await this.episodeStateService.getByIdAndStudent(
      stateId,
      student,
    );
    const stage = await this.episodeStageRepo.getEntryStageForEpisode(
      state.episode,
    );
    await this.episodeStateService.setNextStage(state, stage);
    const content = await this.contentService.getByStage(stage);
    return {
      trait: stage.trait,
      text: _.first(content.texts)?.text ?? '',
    };
  }

  public async showChallenge(
    userId: number,
    stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    const student = await this.studentService.getByUserId(userId);
    const state = await this.episodeStateService.getByIdAndStudent(
      stateId,
      student,
    );
    const stage = await this.episodeStageRepo.getChallengeStageForEpisode(
      state.episode,
    );
    await this.episodeStateService.setNextStage(state, stage);
    const content = await this.contentService.getByStage(stage);
    return {
      trait: stage.trait,
      text: _.first(content.texts)?.text ?? '',
    };
  }

  public async answer(
    userId: number,
    stateId: number,
    answer: string,
  ): Promise<{ trait: Trait; text: string }> {
    const student = await this.studentService.getByUserId(userId);
    const state = await this.episodeStateService.getByIdAndStudent(
      stateId,
      student,
    );

    const currentStage = this.isAnswerRequired(state.episodeStage)
      ? state.episodeStage
      : await this.episodeStageRepo.getChallengeStageForEpisode(state.episode);

    const isAnswerValid = await this.answerValidatorService.validate(
      state.episode,
      answer,
    );

    let stage: EpisodeStage;
    switch (currentStage.trait) {
      case Trait.CHALLENGE:
        stage = isAnswerValid // challenge. success is next stage and error is rollback
          ? currentStage.nextStage
          : currentStage.rollbackStage;
        break;
      case Trait.ERROR:
        stage = isAnswerValid // error. success is rollback stage and error again is next error
          ? currentStage.rollbackStage
          : currentStage.nextStage;
        break;
      default:
        throw new InternalServerErrorException(
          'Not acceptable current stage trait',
        );
    }

    await this.episodeStateService.setNextStage(state, stage);
    const content = await this.contentService.getByStage(stage);
    return {
      trait: stage.trait,
      text: _.first(content.texts)?.text ?? '',
    };
  }

  private async nextByState(state: EpisodeState): Promise<EpisodeStage> {
    const isNewState = _.isNil(state.episodeStage);
    let stage: EpisodeStage;
    if (isNewState) {
      stage = await this.episodeStageRepo.getEntryStageForEpisode(
        state.episode,
      );
    } else {
      const current = await this.episodeStageRepo.findOneOrFail({
        where: {
          id: state.episodeStage.id,
        },
        relations: ['nextStage'],
      });

      stage = this.isAnswerRequired(current)
        ? current
        : await this.episodeStageRepo.findOneOrFail({
            id: current.nextStage.id,
          });
    }

    await this.episodeStateService.setNextStage(state, stage);

    return stage;
  }

  private isAnswerRequired(stage?: EpisodeStage): boolean {
    switch (stage?.trait) {
      case Trait.CHALLENGE:
      case Trait.ERROR:
        return true;
      default:
        return false;
    }
  }

  public async addStage(data: AddStageDto): Promise<EpisodeStage> {
    await Promise.all([
      this.episodeService.assertEpisodeExists(data.episodeId),
      this.assertStageExists(data.nextStageId),
      this.assertStageExists(data.rollbackStageId),
    ]);

    const stage = new EpisodeStage();

    if (data.nextStageId) {
      stage.nextStage = { id: data.nextStageId } as EpisodeStage;
    }

    if (data.rollbackStageId) {
      stage.rollbackStage = { id: data.rollbackStageId } as EpisodeStage;
    }

    stage.content = new Content();
    stage.content.contentType =
      data.trait === Trait.CLUE
        ? ContentTypeEnum.CODEWORD_CLUE
        : ContentTypeEnum.TEXT;

    if (data.text) {
      stage.content.texts = [{ text: data.text } as Text];
    } else if (data.clues?.length) {
      stage.content.codewordClues = data.clues.map(
        (clue) => ({ clue } as CodewordClue),
      );
    } else {
      throw new BadRequestException('Text or Clues required');
    }

    stage.trait = data.trait;

    stage.episode = { id: data.episodeId } as Episode;

    return this.episodeStageRepo.save(stage);
  }

  public async updateStage(data: UpdateStageDto): Promise<EpisodeStage> {
    await Promise.all([
      data.id && this.assertStageExists(data.id),
      data.nextStageId && this.assertStageExists(data.rollbackStageId),
      data.rollbackStageId && this.assertStageExists(data.nextStageId),
    ]);

    const stages = await this.episodeStageRepo.findByIds(
      [data.id, data.rollbackStageId, data.nextStageId].filter(Boolean),
      { relations: ['episode'] },
    );

    if (!stages.every(({ episode: { id } }) => id === stages[0].episode.id)) {
      throw new ForbiddenException('Stages should be for one episode-remove');
    }

    const current = stages.find(({ id }) => id === data.id);

    current.nextStage =
      stages.find(({ id }) => id === data.nextStageId) ?? null;
    current.rollbackStage =
      stages.find(({ id }) => id === data.rollbackStageId) ?? null;

    return this.episodeStageRepo.save(current);
  }

  private async assertStageExists(stageId: number): Promise<void> {
    await this.episodeStageRepo.findOneOrFail(stageId).catch(() => {
      throw new NotFoundException('Stage not found');
    });
  }
}
