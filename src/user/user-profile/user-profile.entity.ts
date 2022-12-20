import { Column, Entity, OneToOne } from 'typeorm';

import { UserRole } from '@cms/utilities/user-role.enum';
import { BaseEntity } from '@cms/utilities/base.entity';
import { ScreenWriter } from '@cms/user/screen-writer/screen-writer.entity';
import { Student } from '@cms/user/student/student.entity';
import { Teacher } from '@cms/user/teacher/teacher.entity';

@Entity({ name: 'user_profile' })
export class UserProfile extends BaseEntity {
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash: string;

  @Column({
    name: 'role',
    type: 'enum',
    enumName: 'user_role_enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToOne(() => ScreenWriter, (screenWriter) => screenWriter.userProfile, {
    nullable: true,
    cascade: true,
  })
  screenWriter?: ScreenWriter;

  @OneToOne(() => Student, (student) => student.userProfile, {
    nullable: true,
    cascade: true,
  })
  student?: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.userProfile, {
    nullable: true,
    cascade: true,
  })
  teacher?: Teacher;
}
