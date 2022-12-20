import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsEpisode } from '@cms/lms/episode/episode.entity';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';

@Entity({ name: 'lms_course' })
@Unique(['humanReadableId'])
export class LmsCourse extends BaseEntity {
  @Column({ name: 'serial_number', type: 'int' })
  serialNumber: number;

  @Column({ name: 'human_readable_id', type: 'varchar', length: '200' })
  humanReadableId: string;

  @OneToMany(() => CourseContent, (lmsContent) => lmsContent.lmsCourse, {
    onDelete: 'CASCADE',
  })
  lmsContent: CourseContent[];

  @OneToMany(() => LmsEpisode, (lmsEpisode) => lmsEpisode.lmsCourse, {
    onDelete: 'CASCADE',
  })
  lmsEpisode: CourseContent[];

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_file' })
  imageFile: FileMetaData;
}
