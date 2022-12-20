import { EntityRepository, Repository } from 'typeorm';

import { Episode } from '@cms/game/episode/episode.entity';

@EntityRepository(Episode)
export class EpisodeRepository extends Repository<Episode> {
  private readonly populatedEpRelations = [
    'episodeStages',
    'episodeStages.content',
    'episodeStages.content.texts',
    'episodeStages.content.codewordClues',
    'episodeStages.nextStage',
    'episodeStages.rollbackStage',
    'answerValidators',
  ];

  public findPublishedByCodeword(
    codeword: string,
    allowNotPublished = false,
  ): Promise<Episode> {
    const query = { codeword, isPublished: true };
    if (allowNotPublished) delete query.isPublished;
    return this.findOneOrFail(query);
  }

  public getPopulatedEpisodes(): Promise<Episode[]> {
    return this.find({
      relations: this.populatedEpRelations,
    });
  }

  public getPopulatedEpisode(id: number): Promise<Episode> {
    return this.findOneOrFail({
      where: { id },
      relations: this.populatedEpRelations,
    });
  }
}
