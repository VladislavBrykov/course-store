import { EntityRepository, Repository } from 'typeorm';

import { Text } from '@cms/game/text/text.entity';

@EntityRepository(Text)
export class TextRepository extends Repository<Text> {
  public getPopulatedText(id: number) {
    return this.findOne({
      where: { id },
      relations: [
        'content',
        'content.episodeStage',
        'content.episodeStage.episode-remove',
      ],
    });
  }
}
