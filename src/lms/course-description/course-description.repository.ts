import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CourseDescription } from '@cms/lms/course-description/course-description.entity';

@EntityRepository(CourseDescription)
export class LmsCourseDescriptionRepository extends Repository<CourseDescription> {
  async findCourseDescription(id): Promise<CourseDescription> {
    return await this.findOne({ where: { id: id } });
  }

  async deleteCourseDescription(id: number): Promise<DeleteResult> {
    const courseDescription = await this.findCourseDescription(id);
    return this.delete(courseDescription.id);
  }
}
