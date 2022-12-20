import { EntityRepository, Repository } from 'typeorm';
import { AnswerValidator } from '@cms/game/answer-validator/answer-validator.entity';
import { Episode } from '@cms/game/episode/episode.entity';

@EntityRepository(AnswerValidator)
export class AnswerValidatorRepository extends Repository<AnswerValidator> {
  public findByEpisode(episode: Episode): Promise<AnswerValidator> {
    return this.findOneOrFail({ episode });
  }
}
