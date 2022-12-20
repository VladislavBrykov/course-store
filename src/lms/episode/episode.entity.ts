import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsCourse } from '@cms/lms/course/course.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';

@Entity({ name: 'lms_episode' })
export class LmsEpisode extends BaseEntity {
  @Column({ name: 'episode_number', type: 'int' })
  episodeNumber: number;

  @Column({ name: 'human_readable_id', type: 'varchar', length: '200' })
  humanReadableId: string;

  @ManyToOne(() => LmsCourse, (lmsCourse) => lmsCourse.lmsContent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lms_course' })
  lmsCourse: LmsCourse;

  @OneToMany(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.lmsEpisode,
    { onDelete: 'CASCADE' },
  )
  lmsEpisodeContent: LmsEpisodeContent[];

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;
}
