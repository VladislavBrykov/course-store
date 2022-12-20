import { EntityRepository, Repository } from 'typeorm';

import { CodewordClueData } from '../../utilities/api-types';
import { CodewordClue } from './codeword-clue.entity';

@EntityRepository(CodewordClue)
export class CodewordClueRepository extends Repository<CodewordClue> {
  public getPopulatedClue(id: number): Promise<CodewordClue> {
    return this.findOneOrFail({
      where: { id },
      relations: [
        'content',
        'content.episodeStage',
        'content.episodeStage.episode-remove',
      ],
    });
  }
}
