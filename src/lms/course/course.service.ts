import { Injectable } from '@nestjs/common';

import { LmsCourseRepository } from '@cms/lms/course/course.repository';
import { LmsCourse } from '@cms/lms/course/course.entity';
import { LmsContentRepository } from '@cms/lms/course-content/course-content.repository';
import { LmsCourseDescriptionRepository } from '@cms/lms/course-description/course-description.repository';
import { LmsEpisodeContentRepository } from '@cms/lms/episode-content/episode-content.repository';
import { CardName } from '@cms/utilities/card-name.enum';
import { LmsCourseSummaryItemRepository } from '@cms/lms/course-summary-item/course-summary-item.repository';
import {
  ContentRequest,
  CourseDetailsRes,
  CourseRes,
  EpisodeRequest,
} from '@cms/utilities/lms-types';
import { Lang } from '@cms/utilities/lang.enum';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';
import { CourseDescription } from '@cms/lms/course-description/course-description.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';
import { CourseSummaryItem } from '@cms/lms/course-summary-item/course-summary-item.entity';

@Injectable()
export class CourseService {
  constructor(
    private courseRepository: LmsCourseRepository,
    private courseContentRepository: LmsContentRepository,
    private courseDescriptionRepository: LmsCourseDescriptionRepository,
    private episodeContentRepository: LmsEpisodeContentRepository,
    private courseSummaryItemRepository: LmsCourseSummaryItemRepository,
  ) {}

  async findAllCoursesByLanguage(language: Lang): Promise<CourseRes[]> {
    const allCourses: LmsCourse[] = await this.courseRepository.find({
      relations: ['imageFile', 'lmsContent'],
    });
    return await Promise.all(
      allCourses.map(async (course) => {
        const content: CourseContent =
          await this.courseContentRepository.findOne({
            where: { language: language, lmsCourse: course.id },
          });
        if (content) {
          const description: CourseDescription =
            await this.courseDescriptionRepository.findOne({
              where: { lmsContent: content.id },
            });
          return {
            courseId: course.id,
            humanReadableId: course.humanReadableId,
            serialNumber: course.serialNumber,
            imageUrl: course.imageFile.url,
            title: description.title,
            description: description.description,
            shortDescription: description.short_description,
          };
        }
      }),
    );
  }

  async findCourseDetails(
    language: Lang,
    humanReadableId: string,
  ): Promise<CourseDetailsRes> {
    const course = await this.courseRepository.findOne({
      where: {
        humanReadableId: humanReadableId,
      },
    });

    const courseWithEpisodes = await this.courseRepository.findOne({
      where: { id: course.id },
      relations: ['lmsEpisode'],
    });

    const content = await this.courseContentRepository.findOne({
      where: { lmsCourse: course.id, language },
    });

    const episodeContent: EpisodeRequest[] = await this.findEpisodeContent(
      language,
      courseWithEpisodes.lmsEpisode,
    );

    const courseContent: ContentRequest = await this.findCourseContent(
      language,
      content,
    );
    return { episodeContent, courseContent };
  }

  async findEpisodeContent(
    language: Lang,
    episodes,
  ): Promise<EpisodeRequest[]> {
    const episodeContents = await Promise.all(
      episodes.map(async (episode) => {
        const episodeContent: LmsEpisodeContent =
          await this.episodeContentRepository.findOne({
            where: {
              lmsEpisode: episode.id,
              language: language,
            },
            relations: [
              'imageFile',
              'activityFile',
              'episodeGuideFile',
              'homeworkFile',
              'homeworkGuideFile',
              'worksheetFile',
            ],
          });
        return {
          id: episode.id,
          number: episode.episodeNumber,
          humanReadableId: episode.humanReadableId,
          title: episodeContent.title,
          learningOutcome: episodeContent.learningOutcome,
          language: episodeContent.language,
          imageUrl: episodeContent.imageFile.url,
          activityUrl: episodeContent.activityFile.url,
          episodeGuide: episodeContent.episodeGuideFile.url,
          homework: episodeContent.homeworkFile.url,
          homeworkGuide: episodeContent.episodeGuideFile.url,
          worksheet: episodeContent.worksheetFile.url,
        };
      }),
    );
    return episodeContents.sort(function (a, b) {
      return a.number - b.number;
    });
  }

  async findCourseContent(language: Lang, content): Promise<any> {
    if (content.language == language) {
      const description: CourseDescription =
        await this.courseDescriptionRepository.findOne({
          where: { lmsContent: content.id },
        });

      const summaryItemCourseModule: CourseSummaryItem[] =
        await this.courseSummaryItemRepository.find({
          where: {
            lmsContent: content.id,
            cardName: CardName.COURSE_MODULE,
          },
        });

      const summaryItemClassroomMaterial: CourseSummaryItem[] =
        await this.courseSummaryItemRepository.find({
          where: {
            lmsContent: content.id,
            cardName: CardName.CLASSROOM_MATERIALS,
          },
        });

      const summaryItemCurriculumOverview: CourseSummaryItem[] =
        await this.courseSummaryItemRepository.find({
          where: {
            lmsContent: content.id,
            cardName: CardName.CURRICULUM_OVERVIEW,
          },
        });
      const summaryItemMissionOverview: CourseSummaryItem[] =
        await this.courseSummaryItemRepository.find({
          where: {
            lmsContent: content.id,
            cardName: CardName.MISSION_OVERVIEW,
          },
        });

      summaryItemClassroomMaterial.sort(
        (x, y) => x.serialNumber - y.serialNumber,
      );

      summaryItemMissionOverview.sort(
        (x, y) => x.serialNumber - y.serialNumber,
      );

      summaryItemCurriculumOverview.sort(
        (x, y) => x.serialNumber - y.serialNumber,
      );

      summaryItemCourseModule.sort((x, y) => x.serialNumber - y.serialNumber);

      return {
        description,
        summaryItemCourseModule,
        summaryItemCurriculumOverview,
        summaryItemMissionOverview,
        summaryItemClassroomMaterial,
      };
    }
  }
}
