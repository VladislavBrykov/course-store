import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'lms_note' })
@Unique(['humanReadableId'])
export class LmsNote extends BaseEntity {
  @Column({ name: 'human_readable_id', type: 'varchar', length: '500' })
  humanReadableId: string;

  @Column({
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
  })
  language: Lang;

  @OneToOne(
    () => LmsEpisodeContent,
    (lmsEpisodeContent) => lmsEpisodeContent.note,
    {
      onDelete: 'CASCADE',
    },
  )
  lmsNote: LmsNote;

  @OneToOne(() => FileMetaData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_file' })
  noteFile: FileMetaData;
}
