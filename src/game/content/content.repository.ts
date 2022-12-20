import { EntityRepository, Repository } from 'typeorm';

import { Content } from '@cms/game/content/content.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';

@EntityRepository(Content)
export class ContentRepository extends Repository<Content> {
  public getByStage(stage: EpisodeStage): Promise<Content> {
    return this.findOneOrFail({
      where: { episodeStage: stage },
      relations: ['texts', 'codewordClues'],
    });
  }
}
