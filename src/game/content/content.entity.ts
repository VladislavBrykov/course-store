import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { ContentTypeEnum } from '@cms/utilities/content-type.enum';
import { CodewordClue } from '@cms/game/codeword-clue/codeword-clue.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { Text } from '@cms/game/text/text.entity';

@Entity({ name: 'content' })
export class Content extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ContentTypeEnum,
    name: 'content_type',
    enumName: 'content_type_enum',
  })
  contentType: ContentTypeEnum;

  @OneToOne(() => EpisodeStage, (episodeStage) => episodeStage.content, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'episode_stage_id' })
  episodeStage: EpisodeStage;

  @OneToMany(() => Text, (text) => text.content, { cascade: true })
  texts: Text[];

  @OneToMany(() => CodewordClue, (codewordClue) => codewordClue.content, {
    cascade: true,
  })
  codewordClues: CodewordClue[];
}
