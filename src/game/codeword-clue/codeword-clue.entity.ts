import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { Content } from '@cms/game/content/content.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'codeword_clue' })
export class CodewordClue extends BaseEntity {
  @Column({ name: 'clue', type: 'varchar' })
  clue: string;

  @Column({
    name: 'lang',
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
    default: Lang.ENG,
  })
  lang: Lang;

  @ManyToOne(() => Content, (content) => content.codewordClues, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'content_id' })
  content: Content;

  @OneToMany(
    () => EpisodeState,
    (episodeState) => episodeState.shownCodewordClue,
    { cascade: true },
  )
  episodeStates: EpisodeState[];
}
