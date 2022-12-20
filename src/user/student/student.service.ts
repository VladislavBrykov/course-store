import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentRepository } from '@cms/user/student/student.repository';
import { Student } from '@cms/user/student/student.entity';

@Injectable()
export class StudentService {
  constructor(private studentRepo: StudentRepository) {}

  public getByUserId(userId: number): Promise<Student> {
    return this.studentRepo.getByUserId(userId).catch(() => {
      throw new NotFoundException('Student not found');
    });
  }

  public getByPlayerName(playerName: string): Promise<Student> {
    return this.studentRepo.getByPlayerName(playerName);
  }

  public assertPlayerNameNotInUse(
    playerName: string,
    excludingUserId?: number,
  ): Promise<void> {
    return this.getByPlayerName(playerName).then((existingStudent) => {
      if (existingStudent && existingStudent.userProfile.id !== excludingUserId)
        throw new ForbiddenException(
          `Player name ${playerName} is already in use`,
        );
    });
  }

  public updatePlayerName(
    userId: number,
    playerName: string,
  ): Promise<Student> {
    return this.studentRepo.updatePlayerName(userId, playerName);
  }
}
