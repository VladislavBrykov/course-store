import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@cms/utilities/base.entity';
import { LmsCourse } from '@cms/lms/course/course.entity';
import { CourseDescription } from '@cms/lms/course-description/course-description.entity';
import { CourseSummaryItem } from '@cms/lms/course-summary-item/course-summary-item.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'lms_course_content' })
export class CourseContent extends BaseEntity {
  @Column({
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
  })
  language: Lang;

  @ManyToOne(() => LmsCourse, (lmsCourse) => lmsCourse.lmsContent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lms_course_id' })
  lmsCourse: LmsCourse;

  @OneToOne(
    () => CourseDescription,
    (courseDescription) => courseDescription.lmsContent,
    { onDelete: 'CASCADE' },
  )
  courseDescription: CourseDescription;

  @OneToMany(() => CourseSummaryItem, (courseBlock) => courseBlock.lmsContent, {
    onDelete: 'CASCADE',
  })
  courseBlock: CourseSummaryItem[];

  @Column({ name: 'external_id', type: 'int', unique: true })
  externalId: number;
}
