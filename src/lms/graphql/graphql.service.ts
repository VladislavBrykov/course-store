import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CourseResponse, Header } from '@cms/utilities/lms-types';
import { GraphQlQuery, LmsUrl, MethodHttp } from '@cms/utilities/lms.enum';
import { GenerateGraphqlQuery } from '@cms/lms/helpers/generate-graphql-query';
import { CourseResponseValidation } from '@cms/lms/helpers/validation/z-validation';

@Injectable()
export class GraphqlService {
  constructor(private configService: ConfigService) {}

  async findCourseById(id: number): Promise<CourseResponse> {
    const headersRequest: Header = {
      Authorization: `bearer ${this.configService.get('LMS_TOKEN')}`,
    };

    return axios({
      url: LmsUrl.GRAPHQL + '/graphql',
      method: MethodHttp.POST,
      headers: headersRequest,
      data: {
        query: GenerateGraphqlQuery(id, GraphQlQuery.ALL_COURSES),
      },
    }).then(
      (result) =>
        CourseResponseValidation.parse(
          result.data as CourseResponse,
        ) as CourseResponse,
    );
  }
}
