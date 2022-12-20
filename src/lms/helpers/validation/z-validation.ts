import { z } from 'zod';

const File = z.object({
  data: z
    .array(
      z.object({
        id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
        attributes: z.object({
          url: z.string().min(1).max(1000),
          size: z.number().min(0).max(100000),
          name: z.string().min(1).max(1000),
          ext: z.string().min(1).max(30),
          hash: z.string().min(1).max(1000),
        }),
      }),
    )
    .length(1)
    .transform(([file]) => file),
});

export const CourseResponseValidation = z.object({
  data: z.object({
    course: z.object({
      data: z.object({
        id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
        attributes: z.object({
          serial_number: z.number().min(0).max(100),
          human_readable_id: z.string().min(1).max(200),
          image: File,
          episodes: z.object({
            data: z.array(
              z.object({
                id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
                attributes: z.object({
                  episode_number: z.number(),
                  human_readable_id: z.string().min(1).max(200),
                  episode_contents: z.object({
                    data: z.array(
                      z.object({
                        id: z
                          .number()
                          .or(z.string().regex(/^\d+$/).transform(Number)),
                        attributes: z.object({
                          title: z.string().min(1).max(1000),
                          learning_outcome: z.string().min(1).max(1000),
                          language: z.string(),
                          image: File,
                          activity: File,
                          episode_guide: File,
                          homework: File,
                          homework_guide: File,
                          worksheet: File,
                          notes: z.object({
                            data: z
                              .array(
                                z
                                  .object({
                                    id: z
                                      .number()
                                      .or(
                                        z
                                          .string()
                                          .regex(/^\d+$/)
                                          .transform(Number),
                                      ),
                                    attributes: z.object({
                                      human_readable_id: z
                                        .string()
                                        .min(1)
                                        .max(1000),
                                      file: File,
                                    }),
                                  })
                                  .optional(),
                              )
                              .transform(([file]) => file),
                          }),
                        }),
                      }),
                    ),
                  }),
                }),
              }),
            ),
          }),
          course_contents: z.object({
            data: z.array(
              z.object({
                id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
                attributes: z.object({
                  language: z.string(),
                  course_summary_items: z.object({
                    data: z.array(
                      z.object({
                        id: z
                          .number()
                          .or(z.string().regex(/^\d+$/).transform(Number)),
                        attributes: z.object({
                          title: z.string().min(1).max(1000),
                          card_name: z.string().min(1).max(300),
                          body: z.string().min(1).max(3000),
                          serial_number: z.number().min(0).max(100),
                        }),
                      }),
                    ),
                  }),
                  course_description: z.object({
                    data: z.object({
                      id: z
                        .number()
                        .or(z.string().regex(/^\d+$/).transform(Number)),
                      attributes: z.object({
                        title: z.string().min(1).max(1000),
                        short_description: z.string().min(1).max(2000),
                        description: z.string().min(1).max(3000),
                      }),
                    }),
                  }),
                }),
              }),
            ),
          }),
        }),
      }),
    }),
  }),
});
