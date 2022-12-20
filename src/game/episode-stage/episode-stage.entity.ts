import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { Trait } from '@cms/utilities/trait.enum';
import { Content } from '@cms/game/content/content.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';

@Entity({ name: 'episode_stage' })
export class EpisodeStage extends BaseEntity {
  @Column({
    type: 'enum',
    enumName: 'episode_stage_trait_enum',
    enum: Trait,
  })
  trait: Trait;

  @Column({ name: 'is_entry_point', type: 'boolean', default: false })
  isEntryPoint: boolean;

  @ManyToOne(() => EpisodeStage, (stage) => stage.previousStages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'next_stage_id' })
  nextStage?: EpisodeStage;

  @OneToMany(() => EpisodeStage, ({ nextStage }) => nextStage)
  previousStages: EpisodeStage[];

  @ManyToOne(() => EpisodeStage, ({ rollbackFrom }) => rollbackFrom, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'rollback_stage_id' })
  rollbackStage?: EpisodeStage;

  @OneToMany(() => EpisodeStage, ({ rollbackStage }) => rollbackStage)
  rollbackFrom?: EpisodeStage[];

  @ManyToOne(() => Episode, (episode) => episode.episodeStages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'episode_id' })
  episode: Episode;

  @OneToMany(() => EpisodeState, (episodeState) => episodeState.episodeStage, {
    cascade: true,
  })
  episodeStates: EpisodeState[];

  @OneToOne(() => Content, (content) => content.episodeStage, { cascade: true })
  content: Content;
}
