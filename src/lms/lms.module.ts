import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LmsService } from './lms.service';
import { ConfigModule } from '@nestjs/config';
import { LmsController } from '@cms/lms/lms.controller';
import { HttpModule } from '@nestjs/axios';
import { GraphqlModule } from '@cms/lms/graphql/graphql.module';
import { LmsCourseDescriptionRepository } from '@cms/lms/course-description/course-description.repository';
import { LmsCourseRepository } from './course/course.repository';
import { CourseDescription } from '@cms/lms/course-description/course-description.entity';
import { LmsEpisode } from '@cms/lms/episode/episode.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';
import { LmsEpisodeRepository } from '@cms/lms/episode/episode.repository';
import { LmsEpisodeContentRepository } from '@cms/lms/episode-content/episode-content.repository';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';
import { LmsContentRepository } from '@cms/lms/course-content/course-content.repository';
import { CourseSummaryItem } from '@cms/lms/course-summary-item/course-summary-item.entity';
import { LmsCourseSummaryItemRepository } from '@cms/lms/course-summary-item/course-summary-item.repository';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';
import { FileMetaDataRepository } from '@cms/lms/meta-data/meta-data.repository';
import { LmsNote } from '@cms/lms/note/note.entity';
import { NoteRepository } from '@cms/lms/note/note.repository';
import { CourseModule } from '@cms/lms/course/course.module';
import { NoteModule } from '@cms/lms/note/note.module';

@Module({
  controllers: [LmsController],
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      CourseContent,
      CourseSummaryItem,
      CourseDescription,
      LmsEpisode,
      LmsEpisodeContent,
      FileMetaData,
      LmsNote,
      LmsCourseRepository,
      LmsContentRepository,
      LmsCourseDescriptionRepository,
      LmsCourseSummaryItemRepository,
      LmsEpisodeRepository,
      LmsEpisodeContentRepository,
      FileMetaDataRepository,
      NoteRepository,
    ]),
    GraphqlModule,
    CourseModule,
    NoteModule,
  ],
  providers: [LmsService],
  exports: [LmsService],
})
export class LmsModule {}
