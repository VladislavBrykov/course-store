import { Controller, Post, Req } from '@nestjs/common';
import { LmsService } from '@cms/lms/lms.service';
import { Request } from 'express';
import { findCoursePublishEvent } from '@cms/lms/helpers/find-course_publish-event';
import { GraphqlService } from '@cms/lms/graphql/graphql.service';
import { CourseResponse, Event } from '@cms/utilities/lms-types';

@Controller('lms-course')
export class LmsController {
  constructor(
    private lmsService: LmsService,
    private graphqlService: GraphqlService,
  ) {}

  @Post('webhook/course-publish')
  async coursePublish(@Req() request: Request): Promise<void> {
    const event: Event = request.body;
    if (findCoursePublishEvent(event)) {
      const course: CourseResponse = await this.graphqlService.findCourseById(
        event.entry.id,
      );
      await this.lmsService.handleWriteCourse(course);
    }
  }
}
