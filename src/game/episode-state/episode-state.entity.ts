import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Student } from '@cms/user/student/student.entity';
import { BaseEntity } from '@cms/utilities/base.entity';
import { CodewordClue } from '@cms/game/codeword-clue/codeword-clue.entity';
import { Episode } from '@cms/game/episode/episode.entity';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';

@Entity({ name: 'episode_state' })
export class EpisodeState extends BaseEntity {
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => Episode, (episode) => episode.episodeStates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'episode_id' })
  episode: Episode;

  @ManyToOne(() => Student, (student) => student.episodeStates, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'student_id' })
  student: Student;

  @ManyToOne(() => EpisodeStage, (episodeStage) => episodeStage.episodeStates, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'episode_stage_id' })
  episodeStage?: EpisodeStage;

  @ManyToOne(() => CodewordClue, (codewordClue) => codewordClue.episodeStates, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'shown_clue_id' })
  shownCodewordClue?: CodewordClue;
}
