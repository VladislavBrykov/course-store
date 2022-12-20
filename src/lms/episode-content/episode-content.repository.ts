import { EntityRepository, Repository } from 'typeorm';
import { LmsEpisodeContent } from '@cms/lms/episode-content/episode-content.entity';

@EntityRepository(LmsEpisodeContent)
export class LmsEpisodeContentRepository extends Repository<LmsEpisodeContent> {}
