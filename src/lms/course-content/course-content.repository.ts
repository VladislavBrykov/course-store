import { EntityRepository, Repository } from 'typeorm';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';

@EntityRepository(CourseContent)
export class LmsContentRepository extends Repository<CourseContent> {}
