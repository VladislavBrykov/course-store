import { Injectable } from '@nestjs/common';
import { Episode } from '@cms/game/episode/episode.entity';

@Injectable()
export class EpisodeMapper {
  public mapPopulatedEpisode({ episodeStages, ...episode }: Episode) {
    return {
      ...episode,
      episodeStages: episodeStages
        .map(({ nextStage, rollbackStage, ...stage }) => ({
          nextStage: nextStage?.id,
          rollbackStage: rollbackStage?.id,
          ...stage,
        }))
        .sort(({ id: a }, { id: b }) => a - b),
    };
  }
}
