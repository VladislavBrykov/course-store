import { Controller, Get, Param } from '@nestjs/common';
import { NoteService } from '@cms/lms/note/note.service';
import { LmsNote } from '@cms/lms/note/note.entity';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get(':name')
  async findNote(@Param('name') name: string): Promise<LmsNote> {
    return await this.noteService.findNoteByHumanReadableId(name);
  }
}
