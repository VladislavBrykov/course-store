import { Injectable } from '@nestjs/common';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';
import { Content } from '@cms/game/content/content.entity';
import { ContentRepository } from '@cms/game/content/content.repository';

@Injectable()
export class ContentService {
  constructor(private contentRepo: ContentRepository) {}

  public getByStage(stage: EpisodeStage): Promise<Content> {
    return this.contentRepo.getByStage(stage);
  }
}
