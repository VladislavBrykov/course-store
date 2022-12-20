import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';
import { LmsCourse } from '@cms/lms/course/course.entity';
import { LmsNote } from '@cms/lms/note/note.entity';

@Entity({ name: 'lms_meta_data' })
export class FileMetaData extends BaseEntity {
  @Column({ name: 'file_name', type: 'varchar', length: '500' })
  fileName: string;

  @Column({ name: 'url', type: 'varchar', length: '1000' })
  url: string;

  @Column({ name: 'ext', type: 'varchar', length: '1000' })
  ext: string;

  @Column({ name: 'size', type: 'int' })
  size: number;

  @Column({ name: 'external_id', type: 'varchar', length: '1000' })
  externalId: string;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.imageFile,
    { onDelete: 'CASCADE' },
  )
  lmsImage: LmsEpisodeContent;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.activityFile,
    { onDelete: 'CASCADE' },
  )
  lmsActivity: LmsEpisodeContent;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.episodeGuideFile,
    { onDelete: 'CASCADE' },
  )
  lmsEpisodeGuide: LmsEpisodeContent;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.homeworkFile,
    { onDelete: 'CASCADE' },
  )
  lmsHomework: LmsEpisodeContent;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.homeworkGuideFile,
    { onDelete: 'CASCADE' },
  )
  lmsHomeworkGuide: LmsEpisodeContent;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.worksheetFile,
    { onDelete: 'CASCADE' },
  )
  lmsWorksheet: LmsEpisodeContent;

  @OneToOne(() => LmsCourse, (lmsCourse) => lmsCourse.imageFile, {
    onDelete: 'CASCADE',
  })
  lmsCourseImage: LmsCourse;

  @OneToOne(() => LmsNote, (lmsNote) => lmsNote.noteFile, {
    onDelete: 'CASCADE',
  })
  lmsNoteFile: LmsNote;
}
