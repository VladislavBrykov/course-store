export const GenerateGraphqlQuery = (courseId: number, query: string) => {
  return query.replace('courseId', courseId.toString());
};
