import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { UserProfile } from '@cms/user/user-profile/user-profile.entity';

@Entity({ name: 'screen_writer' })
export class ScreenWriter extends BaseEntity {
  @OneToOne(() => UserProfile)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_profile_id' })
  userProfile: UserProfile;
}
