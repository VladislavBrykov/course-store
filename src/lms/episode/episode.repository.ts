import { EntityRepository, Repository } from 'typeorm';
import { LmsEpisode } from '@cms/lms/episode/episode.entity';

@EntityRepository(LmsEpisode)
export class LmsEpisodeRepository extends Repository<LmsEpisode> {}
