import { Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from '@cms/game/episode/episode.entity';
import { AnswerValidatorRepository } from '@cms/game/answer-validator/answer-validator.repository';

@Injectable()
export class AnswerValidatorService {
  constructor(private answerValidatorRepo: AnswerValidatorRepository) {}

  public async validate(episode: Episode, answer: string): Promise<boolean> {
    const { validatorFunction: validator } = await this.answerValidatorRepo
      .findByEpisode(episode)
      .catch(() => {
        throw new NotFoundException('Validator not found');
      });

    return eval(this.validatorEvaluationTemplate(validator, answer));
  }

  /*
   * @param {string} validator
   * function like (answer) => answer === 'foo';
   * should return answer as a string and returns boolean
   *
   * @answer {string} answer
   * just an answer with a string
   *
   * @returns {string}
   * it would be a string of immediately invoked function like
   * '((answer) => answer === 'foo')('baz');'
   * that could be just evaluated with eval(...) function
   * */
  private validatorEvaluationTemplate(
    validator: string,
    answer: string,
  ): string {
    return `(${validator})(${JSON.stringify(answer)});`;
  }
}
