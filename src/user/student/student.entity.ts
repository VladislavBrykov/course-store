import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';

@Entity({ name: 'student' })
export class Student extends BaseEntity {
  @Column({ name: 'is_test', type: 'boolean', default: false, select: false })
  isTest: boolean;

  @Column({ name: 'player_name', type: 'varchar', nullable: true })
  @Index({ unique: true })
  playerName?: string;

  @OneToOne(() => UserProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: 'id', name: 'user_profile_id' })
  userProfile: UserProfile;

  @OneToMany(() => EpisodeState, (episodeState) => episodeState.student)
  episodeStates: EpisodeState[];
}
