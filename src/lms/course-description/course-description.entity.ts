import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';

@Entity({ name: 'lms_course_description' })
export class CourseDescription extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', length: '500' })
  title: string;

  @Column({ name: 'short_description', type: 'varchar', length: '1000' })
  short_description?: string;

  @Column({ name: 'description', type: 'varchar', length: '3000' })
  description?: string;

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;

  @OneToOne(() => CourseContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lms_course_content' })
  lmsContent: CourseContent;
}
