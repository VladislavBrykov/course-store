import { EntityRepository, Repository } from 'typeorm';

import { Student } from './student.entity';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
  public async createStudent(
    userProfileId: number,
    data: Partial<Student> = {},
  ): Promise<Student> {
    return this.save({
      userProfile: { id: userProfileId },
      ...data,
    });
  }

  public isTestStudentByUserId(userId): Promise<boolean> {
    return this.findOneOrFail({
      where: {
        userProfile: {
          id: userId,
        },
      },
      select: ['isTest'],
    }).then(({ isTest }) => isTest);
  }

  public getByUserId(userId: number): Promise<Student> {
    return this.findOneOrFail({ userProfile: { id: userId } });
  }

  public getByPlayerName(playerName: string): Promise<Student> {
    return this.findOne({ where: { playerName }, relations: ['userProfile'] });
  }

  public updatePlayerName(
    userId: number,
    newPlayerName: string,
  ): Promise<Student> {
    return this.findOne({ where: { userProfile: { id: userId } } }).then(
      (existingStudent) => {
        if (existingStudent.playerName === newPlayerName) {
          return existingStudent;
        }
        existingStudent.playerName = newPlayerName;
        return this.save(existingStudent);
      },
    );
  }
}
