import { EntityRepository, Repository } from 'typeorm';
import { CourseSummaryItem } from '@cms/lms/course-summary-item/course-summary-item.entity';

@EntityRepository(CourseSummaryItem)
export class LmsCourseSummaryItemRepository extends Repository<CourseSummaryItem> {}
