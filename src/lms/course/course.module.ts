import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LmsCourseRepository } from '@cms/lms/course/course.repository';
import { CourseService } from '@cms/lms/course/course.service';
import { CourseController } from '@cms/lms/course/course.controller';
import { LmsContentRepository } from '@cms/lms/course-content/course-content.repository';
import { LmsCourseDescriptionRepository } from '@cms/lms/course-description/course-description.repository';
import { LmsEpisodeContentRepository } from '@cms/lms/episode-content/episode-content.repository';
import { LmsCourseSummaryItemRepository } from '@cms/lms/course-summary-item/course-summary-item.repository';

@Module({
  controllers: [CourseController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      LmsCourseRepository,
      LmsContentRepository,
      LmsCourseDescriptionRepository,
      LmsEpisodeContentRepository,
      LmsCourseSummaryItemRepository,
    ]),
  ],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
