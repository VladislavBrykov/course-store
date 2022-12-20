import { Event } from '@cms/utilities/lms-types';
import { EventModel } from '@cms/utilities/lms.enum';

export const findCoursePublishEvent = (event: Event) => {
  return event.model === EventModel.COURSE;
};
