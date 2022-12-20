import { EntityRepository, Repository } from 'typeorm';

import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { Trait } from '@cms/utilities/trait.enum';

@EntityRepository(EpisodeStage)
export class EpisodeStageRepository extends Repository<EpisodeStage> {
  public getEntryStageForEpisode(episode: Episode): Promise<EpisodeStage> {
    return this.findOneOrFail({
      where: { episode, isEntryPoint: true },
    });
  }

  public getChallengeStageForEpisode(episode: Episode): Promise<EpisodeStage> {
    return this.findOneOrFail({
      where: { episode, trait: Trait.CHALLENGE },
      relations: ['nextStage', 'rollbackStage'],
    });
  }
}
