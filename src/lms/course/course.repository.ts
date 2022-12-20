import { EntityRepository, Repository } from 'typeorm';

import { LmsCourse } from './course.entity';

@EntityRepository(LmsCourse)
export class LmsCourseRepository extends Repository<LmsCourse> {}
