import { Injectable, NotFoundException } from '@nestjs/common';
import { _ } from '@cms/utilities/lodash';
import { EpisodeStateRepository } from '@cms/game/episode-state/episode-state.repository';
import { Episode } from '@cms/game/episode/episode.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { StudentService } from '@cms/user/student/student.service';
import { Student } from '@cms/user/student/student.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';

@Injectable()
export class EpisodeStateService {
  constructor(
    private episodeStateRepo: EpisodeStateRepository,
    private studentService: StudentService,
  ) {}

  public async getOrCreateByEpisodeAndStudentUserId(
    episode: Episode,
    userId: number,
  ): Promise<EpisodeState> {
    const student = await this.studentService.getByUserId(userId);

    const existingState = await this.episodeStateRepo.getByStudentAndEpisode(
      student,
      episode,
    );

    if (!_.isNil(existingState)) return existingState;

    return this.episodeStateRepo.createForEpisodeAndStudent(student, episode);
  }

  public async getByIdAndStudent(
    id: number,
    student: Student,
  ): Promise<EpisodeState> {
    return this.episodeStateRepo
      .findOneOrFail({
        where: { id, student },
        relations: [
          'episode',
          'episodeStage',
          'episodeStage.nextStage',
          'episodeStage.rollbackStage',
          'shownCodewordClue',
        ],
      })
      .catch(() => {
        throw new NotFoundException('Episode state not found');
      });
  }

  public async setNextStage(
    state: EpisodeState,
    nextStage: EpisodeStage,
  ): Promise<EpisodeState> {
    state.episodeStage = nextStage;
    return await this.episodeStateRepo.save(state);
  }
}
