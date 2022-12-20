import { EntityRepository, Repository } from 'typeorm';

import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { Student } from '@cms/user/student/student.entity';

@EntityRepository(EpisodeState)
export class EpisodeStateRepository extends Repository<EpisodeState> {
  public getByStudentAndEpisode(
    student: Student,
    episode: Episode,
  ): Promise<EpisodeState | undefined> {
    return this.findOne({
      where: {
        episode,
        student,
      },
    });
  }

  public createForEpisodeAndStudent(
    student: Student,
    episode: Episode,
  ): Promise<EpisodeState> {
    return this.save({
      episode,
      student,
    });
  }
}
