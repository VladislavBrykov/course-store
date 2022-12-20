import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { AnswerValidator } from '@cms/game/answer-validator/answer-validator.entity';

@Entity({ name: 'episode' })
export class Episode extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 250 })
  @Index({ unique: true })
  name: string;

  @Column({ name: 'codeword', type: 'varchar', length: 50 })
  @Index({ unique: true })
  codeword: string;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @OneToMany(() => EpisodeStage, (episodeStage) => episodeStage.episode, {
    cascade: true,
  })
  episodeStages: EpisodeStage[];

  @OneToMany(() => EpisodeState, (episodeState) => episodeState.episode, {
    cascade: true,
  })
  episodeStates: EpisodeState[];

  @OneToMany(
    () => AnswerValidator,
    (answerValidator) => answerValidator.episode,
    { cascade: true },
  )
  answerValidators: AnswerValidator[];
}
