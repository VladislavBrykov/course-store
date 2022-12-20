import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { CardName } from '@cms/utilities/card-name.enum';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';

@Entity({ name: 'lms_course_summary_item' })
export class CourseSummaryItem extends BaseEntity {
  @Column({
    type: 'enum',
    enumName: 'card_name',
    enum: CardName,
    name: 'card_name',
  })
  cardName: CardName;

  @Column({ name: 'serial_number', type: 'int' })
  serialNumber: number;

  @Column({ name: 'title', type: 'varchar', length: '500' })
  title: string;

  @Column({ name: 'body', type: 'varchar', length: '3000' })
  body: string;

  @ManyToOne(() => CourseContent, (lmsContent) => lmsContent.courseBlock, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lms_course_content' })
  lmsContent: CourseContent;

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;
}
