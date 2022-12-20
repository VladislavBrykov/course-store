import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsEpisode } from '@cms/lms/episode/episode.entity';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';
import { LmsNote } from '@cms/lms/note/note.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'lms_episode_content' })
export class LmsEpisodeContent extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', length: '500' })
  title: string;

  @Column({ name: 'learning_outcome', type: 'varchar', length: '1000' })
  learningOutcome: string;

  @Column({
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
  })
  language: Lang;

  @ManyToOne(() => LmsEpisode, (lmsEpisode) => lmsEpisode.lmsEpisodeContent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lms_episode' })
  lmsEpisode: LmsEpisode;

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_file' })
  imageFile: FileMetaData;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_file' })
  activityFile: FileMetaData;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'episode_guide_file' })
  episodeGuideFile: FileMetaData;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homework_file' })
  homeworkFile: FileMetaData;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homework_guide_file' })
  homeworkGuideFile: FileMetaData;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'worksheet_file' })
  worksheetFile: FileMetaData;

  @OneToOne(() => LmsNote, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note' })
  note: LmsNote;
}
