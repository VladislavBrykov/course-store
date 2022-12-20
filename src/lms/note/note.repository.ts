import { EntityRepository, Repository } from 'typeorm';
import { LmsNote } from '@cms/lms/note/note.entity';

@EntityRepository(LmsNote)
export class NoteRepository extends Repository<LmsNote> {
  async findByUrl(url: string): Promise<LmsNote> {
    return await this.findOne({
      where: {
        url,
      },
    });
  }
}
