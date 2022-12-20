import { CardName } from '@cms/utilities/card-name.enum';
import { Lang } from '@cms/utilities/lang.enum';

export type contentToSave = {
  externalId: number;
  language: string;
  lmsCourse: number;
  courseExternalId: number;
};

export type courseDescriptionToSave = {
  externalId: number;
  title: string;
  short_description: string;
  description: string;
  lmsContent: undefined;
  contentExternalId: number;
};

export type CourseSummaryItemToSave = {
  externalId: number;
  title: string;
  cardName: string;
  body: string;
  lmsContent: undefined;
  contentExternalId: number;
  serialNumber: number;
};

export type EpisodeToSave = {
  externalId: number;
  episodeNumber: number;
  humanReadableId: string;
  lmsCourse: number;
  courseExternalId: number;
};

export type EpisodeContentToSave = {
  externalId: number;
  title: string;
  learningOutcome: string;
  activityUrl: string;
  episodeGuideUrl: string;
  homeworkUrl: string;
  homeworkGuideUrl: string;
  worksheetUrl: string;
  imageUrl: string;
  language: string;
  lmsEpisode: undefined;
  episodeExternalId: number;
};

export type Course = {
  id: number;
  serialNumber: number;
};

export type Content = {
  language: string;
};

export type CourseDescription = {
  title: string;
  short_description: string;
  description: string;
};

export type CourseSummaryItem = {
  title: string;
  card_name: CardName;
  body: string;
  lmsContent: number;
  serial_number: number;
};

export type EpisodeContent = {
  id: number;
  attributes: {
    title: string;
    learning_outcome: string;
    language: Lang;
    image: { data: Media };
    activity: { data: Media };
    episode_guide: { data: Media };
    homework: { data: Media };
    homework_guide: { data: Media };
    worksheet: { data: Media };
    notes: { data: Note | undefined } | undefined;
  };
};

export type Note = {
  id;
  attributes: {
    human_readable_id: string;
    file: {
      data: {
        id;
        attributes: {
          url: string;
          size: number;
          human_readable_id: string;
          ext: string;
          hash: string;
        };
      };
    };
  };
};

export type Media = {
  id;
  attributes: {
    url: string;
    size: number;
    name: string;
    ext: string;
    hash: string;
  };
};

export type EpisodeData = {
  episode_number: number;
  human_readable_id: string;
  episode_contents: { data: EpisodeContent[] };
};

export type Episode = {
  id: number;
  attributes: EpisodeData;
};

export type CourseResponse = {
  data: {
    course: {
      data: {
        id: number;
        attributes: {
          serial_number: number;
          human_readable_id: string;
          image: { data: Media };
          course_contents: { data: ContentsResponse[] };
          episodes: { data: Episode[] };
        };
      };
    };
  };
};

export type ContentsResponse = {
  id: number;
  attributes: {
    id: number;
    language: Lang;
    course_description: CourseDescriptionResponse;
    course_summary_items: { data: CourseSummaryItemResponse[] };
  };
};

export type CourseDescriptionResponse = {
  data: {
    id: number;
    attributes: CourseDescription;
  };
};

export type CourseSummaryItemResponse = {
  id: number;
  attributes: CourseSummaryItem;
};

export type EpisodeResponse = {
  data: {
    id;
    attributes: Episode[];
  };
};

export type Header = {
  Authorization: string;
};

export type Event = {
  event: string;
  createdAt: string;
  model: string;
  entry: any;
};

export type CourseRes = {
  courseId: number;
  serialNumber: number;
  imageUrl: string;
  title: string;
  description: string;
  shortDescription: string;
  humanReadableId: string;
};

export type EpisodeRequest = {
  id: number;
  number: number;
  humanReadableId: string;
  title: string;
  learningOutcome: string;
  language: Lang;
  imageUrl: string;
  activityUrl: string;
  episodeGuide: string;
  homework: string;
  homeworkGuide: string;
  worksheet: string;
};

export type ContentRequest = {
  description: CourseDescription;
  summaryItems: CourseSummaryItem[];
};

export type CourseDetailsRes = {
  episodeContent: EpisodeRequest[];
  courseContent: ContentRequest;
};
