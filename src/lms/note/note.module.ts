import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NoteRepository } from '@cms/lms/note/note.repository';
import { NoteService } from '@cms/lms/note/note.service';
import { NoteController } from '@cms/lms/note/note.controller';

@Module({
  controllers: [NoteController],
  imports: [ConfigModule, TypeOrmModule.forFeature([NoteRepository])],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
