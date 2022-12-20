import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ContentsResponse,
  CourseSummaryItemResponse,
  CourseDescriptionResponse,
  CourseResponse,
  Episode,
  EpisodeContent,
  Media,
  Note,
} from '@cms/utilities/lms-types';

import { LmsCourseRepository } from '@cms/lms/course/course.repository';
import { LmsCourseDescriptionRepository } from '@cms/lms/course-description/course-description.repository';
import { LmsEpisodeRepository } from '@cms/lms/episode/episode.repository';
import { LmsEpisodeContentRepository } from '@cms/lms/episode-content/episode-content.repository';
import { LmsEpisode } from '@cms/lms/episode/episode.entity';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';
import { CourseDescription } from '@cms/lms/course-description/course-description.entity';
import { LmsCourse } from '@cms/lms/course/course.entity';
import { LmsContentRepository } from '@cms/lms/course-content/course-content.repository';
import { CourseContent } from '@cms/lms/course-content/course-content.entity';
import { CourseSummaryItem } from '@cms/lms/course-summary-item/course-summary-item.entity';
import { LmsCourseSummaryItemRepository } from '@cms/lms/course-summary-item/course-summary-item.repository';
import { FileMetaDataRepository } from '@cms/lms/meta-data/meta-data.repository';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';
import { LmsUrl } from '@cms/utilities/lms.enum';
import { NoteRepository } from '@cms/lms/note/note.repository';
import { LmsNote } from '@cms/lms/note/note.entity';

@Injectable()
export class LmsService {
  constructor(
    private configService: ConfigService,
    private lmsCourseRepository: LmsCourseRepository,
    private lmsContentRepository: LmsContentRepository,
    private lmsCourseDescriptionRepository: LmsCourseDescriptionRepository,
    private lmsCourseSummaryItemRepository: LmsCourseSummaryItemRepository,
    private lmsEpisodeRepository: LmsEpisodeRepository,
    private lmsEpisodeContentRepository: LmsEpisodeContentRepository,
    private fileMetaDataRepository: FileMetaDataRepository,
    private noteRepository: NoteRepository,
  ) {}

  async handleWriteCourse(course: CourseResponse): Promise<void> {
    let existingCourse = await this.findCourse(course);
    if (!existingCourse) existingCourse = await this.newCourse(course);
    else existingCourse = await this.updateCourse(course, existingCourse);

    await this.handleEpisodes(
      existingCourse,
      course.data.course.data.attributes.episodes.data,
    );

    await this.handleContents(
      existingCourse,
      course.data.course.data.attributes.course_contents.data,
    );
  }

  /**
   * Handle Course
   */
  private async newCourse(course: CourseResponse): Promise<LmsCourse> {
    const courseData = course.data.course.data;

    return await this.lmsCourseRepository.save({
      imageFile: await this.mapFile(
        courseData.attributes.image.data,
        new FileMetaData(),
      ),
      serialNumber: courseData.attributes.serial_number,
      externalId: courseData.id,
      humanReadableId: courseData.attributes.human_readable_id,
    });
  }

  private async updateCourse(
    courseRes: CourseResponse,
    lmsCourse: LmsCourse,
  ): Promise<LmsCourse> {
    if (await this.compareCourses(courseRes, lmsCourse)) return lmsCourse;
    return await this.lmsCourseRepository.save(
      await this.mapExistingCourse(courseRes, lmsCourse),
    );
  }

  private async mapExistingCourse(
    courseRes: CourseResponse,
    lmsCourse: LmsCourse,
  ): Promise<LmsCourse> {
    const savedCourse = await this.lmsCourseRepository.findOne({
      where: {
        externalId: courseRes.data.course.data.id,
      },
      relations: ['imageFile'],
    });

    if (
      savedCourse.imageFile.externalId !=
      courseRes.data.course.data.attributes.image.data.attributes.hash
    ) {
      await this.fileMetaDataRepository.delete(savedCourse.imageFile.id);
    }

    lmsCourse.imageFile = await this.mapFile(
      courseRes.data.course.data.attributes.image.data,
      new FileMetaData(),
    );

    lmsCourse.serialNumber =
      courseRes.data.course.data.attributes.serial_number;

    lmsCourse.humanReadableId =
      courseRes.data.course.data.attributes.human_readable_id;
    return lmsCourse;
  }

  private async compareCourses(
    courseRes: CourseResponse,
    lmsCourse?: LmsCourse,
  ): Promise<boolean> {
    if (!lmsCourse) return false;

    const courseData = courseRes.data.course.data;

    if (
      courseData.attributes.image.data.attributes.hash !==
      lmsCourse.imageFile.externalId
    )
      return false;

    return courseData.attributes.serial_number !== lmsCourse.serialNumber;
  }

  private findCourse(course: CourseResponse): Promise<LmsCourse | undefined> {
    return this.lmsCourseRepository.findOne({
      where: {
        externalId: course.data.course.data.id,
      },
      relations: ['imageFile'],
    });
  }

  /**
   * Handle Episodes
   */
  private async handleEpisodes(
    lmsCourse: LmsCourse,
    episodes: Episode[],
  ): Promise<void> {
    const existingEpisodes = await this.loadEpisodesForCourse(lmsCourse);
    const existingEpisodesMapByExternalId = existingEpisodes.reduce(
      (map, ep) => {
        map.set(ep.externalId, ep);
        return map;
      },
      new Map<number, LmsEpisode>(),
    );

    const responseEpisodesMapByExternalId = episodes.reduce((map, ep) => {
      map.set(ep.id, ep);
      return map;
    }, new Map<number, Episode>());

    const toDelete = existingEpisodes.filter(
      ({ externalId }) => !responseEpisodesMapByExternalId.has(externalId),
    );
    const toCreate = episodes.filter(
      ({ id }) => !existingEpisodesMapByExternalId.has(id),
    );
    const toUpdate = episodes.filter(({ id }) =>
      existingEpisodesMapByExternalId.has(id),
    );

    if (toDelete.length)
      await this.lmsEpisodeRepository.delete({
        externalId: In(toDelete.map(({ externalId }) => externalId)),
      });
    if (toCreate.length)
      await this.lmsEpisodeRepository
        .save(
          toCreate.map((ep) => {
            const newEp = this.mapEpisode(ep, new LmsEpisode());
            newEp.lmsCourse = lmsCourse;
            return newEp;
          }),
        )
        .then((eps) =>
          Promise.all(
            eps.map(async (ep) =>
              this.handleContentsData(
                ep,
                responseEpisodesMapByExternalId.get(ep.externalId).attributes
                  .episode_contents.data,
              ),
            ),
          ),
        );

    if (toUpdate.length) {
      const toUpdatesWithDiffs = toUpdate
        .filter((ep) => {
          return this.compareEpisodes(
            ep,
            existingEpisodesMapByExternalId.get(ep.id),
          );
        })
        .map((ep) =>
          this.mapEpisode(ep, existingEpisodesMapByExternalId.get(ep.id)),
        );
      if (toUpdatesWithDiffs.length)
        await this.lmsEpisodeRepository.save(toUpdatesWithDiffs);
      await Promise.all(
        toUpdate.map((ep) =>
          this.handleContentsData(
            existingEpisodesMapByExternalId.get(ep.id),
            responseEpisodesMapByExternalId.get(ep.id).attributes
              .episode_contents.data,
          ),
        ),
      );
    }
  }

  private mapEpisode(resEpisode: Episode, lmsEpisode: LmsEpisode): LmsEpisode {
    lmsEpisode.episodeNumber = resEpisode.attributes.episode_number;
    lmsEpisode.humanReadableId = resEpisode.attributes.human_readable_id;
    lmsEpisode.externalId = resEpisode.id;
    return lmsEpisode;
  }

  private compareEpisodes(
    resEpisode: Episode,
    lmsEpisode: LmsEpisode,
  ): boolean {
    return (
      resEpisode.attributes.episode_number !== lmsEpisode.episodeNumber ||
      resEpisode.attributes.human_readable_id !== lmsEpisode.humanReadableId
    );
  }

  private loadEpisodesForCourse(lmsCourse: LmsCourse): Promise<LmsEpisode[]> {
    return this.lmsEpisodeRepository.find({ lmsCourse });
  }

  /**
   * Episode contents
   */
  private async handleContentsData(
    episode: LmsEpisode,
    epContents: EpisodeContent[],
  ): Promise<void> {
    const existingContents = await this.loadContentsForEpisode(episode);

    const existingContentsMapByExternalId = existingContents.reduce(
      (map, ep) => {
        map.set(ep.externalId, ep);
        return map;
      },
      new Map<number, LmsEpisodeContent>(),
    );

    const responseEpisodeContentsMapByExternalId = epContents.reduce(
      (map, ep) => {
        map.set(ep.id, ep);
        return map;
      },
      new Map<number, EpisodeContent>(),
    );

    const toDelete = existingContents.filter(
      ({ externalId }) =>
        !responseEpisodeContentsMapByExternalId.has(externalId),
    );

    const toCreate = epContents.filter(
      ({ id }) => !existingContentsMapByExternalId.has(id),
    );

    const toUpdate = epContents.filter(({ id }) =>
      existingContentsMapByExternalId.has(id),
    );

    if (toDelete.length) {
      await this.lmsEpisodeContentRepository.delete({
        externalId: In(toDelete.map(({ externalId }) => externalId)),
      });
    }

    if (toUpdate.length) {
      const toUpdatesWithDiffs = await Promise.all(
        toUpdate
          .filter(async (epCont) => {
            return this.compareEpisodeContent(
              epCont,
              existingContentsMapByExternalId.get(epCont.id),
            );
          })
          .map(async (epCont) => {
            return await this.mapEpisodeContent(
              episode,
              epCont,
              existingContentsMapByExternalId.get(epCont.id),
            );
          }),
      );
      if (toUpdatesWithDiffs.length) {
        await this.lmsEpisodeContentRepository.save(toUpdatesWithDiffs);
      }
    }
    if (toCreate.length) {
      await this.lmsEpisodeContentRepository.save(
        await Promise.all(
          toCreate.map(async (epCont) => {
            const newEpCont = await this.mapEpisodeContent(
              episode,
              epCont,
              new LmsEpisodeContent(),
            );
            newEpCont.lmsEpisode = episode;
            return newEpCont;
          }),
        ),
      );
    }
  }

  private loadContentsForEpisode(ep: LmsEpisode): Promise<LmsEpisodeContent[]> {
    return this.lmsEpisodeContentRepository.find({
      where: { lmsEpisode: ep },
      relations: [
        'imageFile',
        'activityFile',
        'episodeGuideFile',
        'homeworkFile',
        'homeworkGuideFile',
        'worksheetFile',
        'note',
      ],
    });
  }

  private async mapFile(
    fileInfo: Media,
    fileMetaData: FileMetaData,
  ): Promise<FileMetaData> {
    const savedFile: FileMetaData = await this.fileMetaDataRepository.findOne({
      where: { externalId: fileInfo.attributes.hash },
    });
    if (!savedFile) {
      fileMetaData.fileName = fileInfo.attributes.name;
      fileMetaData.size = Math.round(fileInfo.attributes.size);
      fileMetaData.url = LmsUrl.GRAPHQL + fileInfo.attributes.url;
      fileMetaData.ext = fileInfo.attributes.ext;
      fileMetaData.externalId = fileInfo.attributes.hash;

      return await this.fileMetaDataRepository.save(fileMetaData);
    }
    return savedFile;
  }

  private async mapNote(
    language,
    fileNote: Note,
    fileNoteData: LmsNote,
  ): Promise<LmsNote> {
    if (typeof fileNote !== 'undefined') {
      const savedNoteFile: FileMetaData =
        await this.fileMetaDataRepository.findOne({
          where: {
            externalId: fileNote.attributes.file.data.attributes.hash,
          },
        });
      if (!savedNoteFile) {
        const newFile = new FileMetaData();
        newFile.fileName =
          fileNote.attributes.file.data.attributes.human_readable_id;
        newFile.size = Math.round(
          fileNote.attributes.file.data.attributes.size,
        );
        newFile.url =
          LmsUrl.GRAPHQL + fileNote.attributes.file.data.attributes.url;
        newFile.ext = fileNote.attributes.file.data.attributes.ext;
        newFile.externalId = fileNote.attributes.file.data.attributes.hash;
        const savedFile = await this.fileMetaDataRepository.save(newFile);
        fileNoteData.humanReadableId = fileNote.attributes.human_readable_id;
        fileNoteData.language = language;
        fileNoteData.noteFile = savedFile;
        return await this.noteRepository.save(fileNoteData);
      }
      const noteInfo: LmsNote = await this.noteRepository.findOne({
        where: {
          noteFile: savedNoteFile.id,
        },
      });
      if (noteInfo) {
        noteInfo.humanReadableId = fileNote.attributes.human_readable_id;
        noteInfo.language = language;
        return await this.noteRepository.save(noteInfo);
      }

      if (!noteInfo) {
        fileNoteData.humanReadableId = fileNote.attributes.human_readable_id;
        fileNoteData.language = language;
        fileNoteData.noteFile = savedNoteFile;
        return await this.noteRepository.save(fileNoteData);
      }
    }
  }

  private async mapEpisodeContent(
    episode,
    episodeContent: EpisodeContent,
    lmsEpisodeContent: LmsEpisodeContent,
  ): Promise<LmsEpisodeContent> {
    lmsEpisodeContent.title = episodeContent.attributes.title;
    lmsEpisodeContent.learningOutcome =
      episodeContent.attributes.learning_outcome;

    const savedEpisodeContent = await this.lmsEpisodeContentRepository.findOne({
      where: {
        id: lmsEpisodeContent.id,
      },
      relations: [
        'imageFile',
        'activityFile',
        'episodeGuideFile',
        'homeworkFile',
        'homeworkGuideFile',
        'worksheetFile',
        'note',
      ],
    });
    if (savedEpisodeContent) {
      const noteDetails = await this.noteRepository.findOne({
        where: { id: savedEpisodeContent.note?.id },
        relations: ['noteFile'],
      });
      if (
        noteDetails &&
        noteDetails.noteFile.externalId !=
          episodeContent.attributes.notes.data.attributes.file.data.attributes
            .hash
      ) {
        await this.fileMetaDataRepository.delete(noteDetails.noteFile.id);
        await this.noteRepository.delete(savedEpisodeContent.note.id);
      }

      if (
        savedEpisodeContent.worksheetFile.externalId !=
        episodeContent.attributes.worksheet.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.worksheetFile.id,
        );
      }

      if (
        savedEpisodeContent.homeworkGuideFile.externalId !=
        episodeContent.attributes.homework_guide.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.homeworkGuideFile.id,
        );
      }

      if (
        savedEpisodeContent.homeworkFile.externalId !=
        episodeContent.attributes.homework.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.homeworkFile.id,
        );
      }

      if (
        savedEpisodeContent.episodeGuideFile.externalId !=
        episodeContent.attributes.episode_guide.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.episodeGuideFile.id,
        );
      }

      if (
        savedEpisodeContent.imageFile.externalId !=
        episodeContent.attributes.image.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.imageFile.id,
        );
      }

      if (
        savedEpisodeContent.activityFile.externalId !=
        episodeContent.attributes.activity.data.attributes.hash
      ) {
        await this.fileMetaDataRepository.delete(
          savedEpisodeContent.activityFile.id,
        );
      }
    }

    lmsEpisodeContent.activityFile = await this.mapFile(
      episodeContent.attributes.activity.data,
      new FileMetaData(),
    );

    lmsEpisodeContent.episodeGuideFile = await this.mapFile(
      episodeContent.attributes.episode_guide.data,
      new FileMetaData(),
    );
    lmsEpisodeContent.homeworkFile = await this.mapFile(
      episodeContent.attributes.homework.data,
      new FileMetaData(),
    );
    lmsEpisodeContent.homeworkGuideFile = await this.mapFile(
      episodeContent.attributes.homework_guide.data,
      new FileMetaData(),
    );
    lmsEpisodeContent.worksheetFile = await this.mapFile(
      episodeContent.attributes.worksheet.data,
      new FileMetaData(),
    );
    lmsEpisodeContent.imageFile = await this.mapFile(
      episodeContent.attributes.image.data,
      new FileMetaData(),
    );
    lmsEpisodeContent.note = await this.mapNote(
      episodeContent.attributes.language,
      episodeContent.attributes.notes.data,
      new LmsNote(),
    );
    lmsEpisodeContent.externalId = episodeContent.id;
    lmsEpisodeContent.language = episodeContent.attributes.language;
    lmsEpisodeContent.lmsEpisode = episode;

    return lmsEpisodeContent;
  }

  private async compareEpisodeContent(
    episodeContent: EpisodeContent,
    lmsEpisodeContent: LmsEpisodeContent,
  ): Promise<boolean> {
    const savedActivity = await this.fileMetaDataRepository.findByExternalId(
      episodeContent.attributes.activity.data.attributes.hash,
    );
    const savedEpisodeGuide =
      await this.fileMetaDataRepository.findByExternalId(
        episodeContent.attributes.episode_guide.data.attributes.hash,
      );

    const savedHomework = await this.fileMetaDataRepository.findByExternalId(
      episodeContent.attributes.homework.data.attributes.hash,
    );

    const savedHomeworkGuide =
      await this.fileMetaDataRepository.findByExternalId(
        episodeContent.attributes.homework_guide.data.attributes.hash,
      );

    const savedWorksheet = await this.fileMetaDataRepository.findByExternalId(
      episodeContent.attributes.worksheet.data.attributes.hash,
    );

    const savedImage = await this.fileMetaDataRepository.findByExternalId(
      episodeContent.attributes.image.data.attributes.hash,
    );
    if (episodeContent.attributes.notes.data) {
      const savedNote = await this.fileMetaDataRepository.findByExternalId(
        episodeContent.attributes.notes.data.attributes.file.data.attributes
          .hash,
      );
      if (savedNote == undefined) {
        return false;
      } else {
        const noteDetails = await this.noteRepository.findOne({
          where: { noteFile: savedNote.id },
        });
        return (
          episodeContent.attributes.title !== lmsEpisodeContent.title ||
          episodeContent.attributes.learning_outcome !==
            lmsEpisodeContent.learningOutcome ||
          savedActivity !== lmsEpisodeContent.activityFile ||
          savedEpisodeGuide !== lmsEpisodeContent.episodeGuideFile ||
          savedHomework !== lmsEpisodeContent.homeworkFile ||
          savedHomeworkGuide !== lmsEpisodeContent.homeworkGuideFile ||
          savedWorksheet !== lmsEpisodeContent.worksheetFile ||
          savedImage !== lmsEpisodeContent.imageFile ||
          episodeContent.attributes.language !== lmsEpisodeContent.language ||
          noteDetails !== lmsEpisodeContent.note
        );
      }
    }
  }

  /**
   * Handle Content
   */

  private async handleContents(
    lmsCourse: LmsCourse,
    contents: ContentsResponse[],
  ): Promise<void> {
    const existingContents = await this.loadContentsForCourse(lmsCourse);
    const existingContentsMapByExternalId = existingContents.reduce(
      (map, ep) => {
        map.set(ep.externalId, ep);
        return map;
      },
      new Map<number, CourseContent>(),
    );

    const responseContentsMapByExternalId = contents.reduce((map, ep) => {
      map.set(ep.id, ep);
      return map;
    }, new Map<number, ContentsResponse>());

    const toDelete = existingContents.filter(
      ({ externalId }) => !responseContentsMapByExternalId.has(externalId),
    );
    const toCreate = contents.filter(
      ({ id }) => !existingContentsMapByExternalId.has(id),
    );
    const toUpdate = contents.filter(({ id }) =>
      existingContentsMapByExternalId.has(id),
    );

    if (toDelete.length)
      await this.lmsContentRepository.delete({
        externalId: In(toDelete.map(({ externalId }) => externalId)),
      });

    if (toCreate.length)
      await this.lmsContentRepository
        .save(
          toCreate.map((cont) => {
            const newCont = this.mapContent(cont, new CourseContent());
            newCont.lmsCourse = lmsCourse;
            return newCont;
          }),
        )
        .then((contents) =>
          Promise.all(
            contents.map(async (content) => {
              const newDesc = this.mapDescription(
                responseContentsMapByExternalId.get(content.externalId)
                  .attributes.course_description,
                new CourseDescription(),
              );
              newDesc.lmsContent = content;
              await this.lmsCourseDescriptionRepository.save(newDesc);
              await this.handleSummaryItem(
                content,
                responseContentsMapByExternalId.get(content.externalId)
                  .attributes.course_summary_items.data,
              );
            }),
          ),
        );

    if (toUpdate.length) {
      await this.lmsContentRepository
        .save(
          toUpdate.map((cont) => {
            const newCont = this.mapContent(
              cont,
              existingContentsMapByExternalId.get(cont.id),
            );
            newCont.lmsCourse = lmsCourse;
            return newCont;
          }),
        )
        .then((contents) =>
          Promise.all(
            contents.map(async (content) => {
              await this.handleCourseDescription(
                content,
                responseContentsMapByExternalId.get(content.externalId)
                  .attributes.course_description,
              );
              await this.handleSummaryItem(
                content,
                responseContentsMapByExternalId.get(content.externalId)
                  .attributes.course_summary_items.data,
              );
            }),
          ),
        );
    }
  }

  private loadContentsForCourse(
    lmsCourse: LmsCourse,
  ): Promise<CourseContent[]> {
    return this.lmsContentRepository.find({ lmsCourse });
  }

  private mapContent(
    resContent: ContentsResponse,
    lmsContent: CourseContent,
  ): CourseContent {
    lmsContent.language = resContent.attributes.language;
    lmsContent.externalId = resContent.id;
    return lmsContent;
  }

  private async handleCourseDescription(
    content: CourseContent,
    courseDescription: CourseDescriptionResponse,
  ): Promise<void> {
    const existingDescription = await this.loadDescriptionForContent(content);

    if (
      existingDescription &&
      courseDescription.data.id != existingDescription.externalId
    ) {
      await this.lmsCourseDescriptionRepository.deleteCourseDescription(
        existingDescription.id,
      );

      const newDesc = this.mapDescription(
        courseDescription,
        new CourseDescription(),
      );
      newDesc.lmsContent = content;

      await this.lmsCourseDescriptionRepository.save(newDesc);
    }

    if (
      existingDescription &&
      courseDescription.data.id === existingDescription.externalId
    ) {
      const updatedDescription = this.mapDescription(
        courseDescription,
        existingDescription,
      );
      updatedDescription.lmsContent = content;
      await this.lmsCourseDescriptionRepository.save(updatedDescription);
    }

    if (!existingDescription) {
      const newDesc = this.mapDescription(
        courseDescription,
        new CourseDescription(),
      );
      newDesc.lmsContent = content;
      await this.lmsCourseDescriptionRepository.save(newDesc);
    }
  }

  private loadDescriptionForContent(
    cont: CourseContent,
  ): Promise<CourseDescription> {
    return this.lmsCourseDescriptionRepository.findOne({
      lmsContent: cont,
    });
  }

  private mapDescription(
    resDescription: CourseDescriptionResponse,
    lmsDescription: CourseDescription,
  ): CourseDescription {
    lmsDescription.title = resDescription.data.attributes.title;
    lmsDescription.short_description =
      resDescription.data.attributes.short_description;
    lmsDescription.description = resDescription.data.attributes.description;
    lmsDescription.externalId = resDescription.data.id;

    return lmsDescription;
  }

  /**
   * Course Summary Item
   */
  private async handleSummaryItem(
    content: CourseContent,
    contSummaryItem: CourseSummaryItemResponse[],
  ): Promise<void> {
    const existingSummaryItem = await this.loadSummaryItemForContent(content);

    const existingSummaryItemMapByExternalId = existingSummaryItem.reduce(
      (map, ep) => {
        map.set(ep.externalId, ep);
        return map;
      },
      new Map<number, CourseSummaryItem>(),
    );

    const responseSummaryItemMapByExternalId = contSummaryItem.reduce(
      (map, ep) => {
        map.set(ep.id, ep);
        return map;
      },
      new Map<number, CourseSummaryItemResponse>(),
    );

    const toDelete = existingSummaryItem.filter(
      ({ externalId }) => !responseSummaryItemMapByExternalId.has(externalId),
    );

    const toCreate = contSummaryItem.filter(
      ({ id }) => !existingSummaryItemMapByExternalId.has(id),
    );

    const toUpdate = contSummaryItem.filter(({ id }) =>
      existingSummaryItemMapByExternalId.has(id),
    );

    if (toDelete.length) {
      await this.lmsCourseSummaryItemRepository.delete({
        externalId: In(toDelete.map(({ externalId }) => externalId)),
      });
    }

    if (toUpdate.length) {
      const toUpdatesWithDiffs = toUpdate
        .filter((cBlock) => {
          return this.compareCourseBlocks(
            cBlock,
            existingSummaryItemMapByExternalId.get(cBlock.id),
          );
        })
        .map((cBlock) => {
          return this.mapSummaryItem(
            cBlock,
            existingSummaryItemMapByExternalId.get(cBlock.id),
          );
        });
      if (toUpdatesWithDiffs.length)
        await this.lmsCourseSummaryItemRepository.save(toUpdatesWithDiffs);
    }
    if (toCreate.length) {
      await this.lmsCourseSummaryItemRepository.save(
        toCreate.map((cBlock) => {
          const newCourseBl = this.mapSummaryItem(
            cBlock,
            new CourseSummaryItem(),
          );
          newCourseBl.lmsContent = content;
          return newCourseBl;
        }),
      );
    }
  }

  private loadSummaryItemForContent(
    cont: CourseContent,
  ): Promise<CourseSummaryItem[]> {
    return this.lmsCourseSummaryItemRepository.find({ lmsContent: cont });
  }

  private compareCourseBlocks(
    courseBlock: CourseSummaryItemResponse,
    lmsCourseBlock: CourseSummaryItem,
  ): boolean {
    return (
      courseBlock.attributes.title != lmsCourseBlock.title ||
      courseBlock.attributes.card_name != lmsCourseBlock.cardName ||
      courseBlock.attributes.body != lmsCourseBlock.body ||
      courseBlock.attributes.serial_number != lmsCourseBlock.serialNumber
    );
  }

  private mapSummaryItem(
    courseSummaryItem: CourseSummaryItemResponse,
    lmsCourseSummaryItem: CourseSummaryItem,
  ): CourseSummaryItem {
    lmsCourseSummaryItem.title = courseSummaryItem.attributes.title;
    lmsCourseSummaryItem.body = courseSummaryItem.attributes.body;
    lmsCourseSummaryItem.cardName = courseSummaryItem.attributes.card_name;
    lmsCourseSummaryItem.externalId = courseSummaryItem.id;
    lmsCourseSummaryItem.serialNumber =
      courseSummaryItem.attributes.serial_number;
    return lmsCourseSummaryItem;
  }
}
