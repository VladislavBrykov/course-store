import { EntityRepository, Repository } from 'typeorm';

import { Teacher } from './teacher.entity';

@EntityRepository(Teacher)
export class TeacherRepository extends Repository<Teacher> {
  async createTeacher(userProfileId: number): Promise<Teacher> {
    const teacher = await this.create({
      userProfile: { id: userProfileId },
    });
    return this.save(teacher);
  }
}
