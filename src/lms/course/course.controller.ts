import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CourseService } from '@cms/lms/course/course.service';
import { CourseDetailsRes, CourseRes } from '@cms/utilities/lms-types';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('find-all-courses')
  async findAllUserProfiles(@Query('language') language): Promise<CourseRes[]> {
    return await this.courseService.findAllCoursesByLanguage(language);
  }

  @Get('/')
  async findCourse(
    @Query('language') language,
    @Query('id') id,
  ): Promise<CourseDetailsRes> {
    return await this.courseService.findCourseDetails(language, id);
  }
}
