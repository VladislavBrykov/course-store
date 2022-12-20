import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'answer_validator' })
export class AnswerValidator extends BaseEntity {
  @Column({ name: 'validator_function', type: 'varchar' })
  validatorFunction: string;

  @Column({
    name: 'lang',
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
    default: Lang.ENG,
  })
  lang: Lang;

  @ManyToOne(() => Episode, (episode) => episode.answerValidators, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'episode_id', referencedColumnName: 'id' })
  episode: Episode;
}
