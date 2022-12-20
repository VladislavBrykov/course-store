import { EntityRepository, Repository } from 'typeorm';

import { ScreenWriter } from './screen-writer.entity';

@EntityRepository(ScreenWriter)
export class ScreenWriterRepository extends Repository<ScreenWriter> {
  async createScreenWriter(userProfileId: number): Promise<ScreenWriter> {
    return this.save({
      userProfile: { id: userProfileId },
    });
  }
}
