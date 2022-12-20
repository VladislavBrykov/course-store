import { Injectable } from '@nestjs/common';
import { NoteRepository } from '@cms/lms/note/note.repository';
import { LmsNote } from '@cms/lms/note/note.entity';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async findNoteByHumanReadableId(id: string): Promise<LmsNote> {
    return this.noteRepository.findOne({
      where: { humanReadableId: id },
      relations: ['noteFile'],
    });
  }
}
