import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CodewordClueRepository } from '@cms/game/codeword-clue/codeword-clue.repository';
import { ContentRepository } from '@cms/game/content/content.repository';
import { EpisodeRepository } from '@cms/game/episode/episode.repository';
import { EpisodeStageRepository } from '@cms/game/episode-stage/episode-stage.repository';
import { EpisodeStateRepository } from '@cms/game/episode-state/episode-state.repository';
import { GameController } from '@cms/game/game.controller';
import { TextRepository } from '@cms/game/text/text.repository';
import { AnswerValidatorRepository } from '@cms/game/answer-validator/answer-validator.repository';
import { EpisodeService } from '@cms/game/episode/episode.service';
import { EpisodeStateService } from '@cms/game/episode-state/episode-state.service';
import { UserModule } from '@cms/user/user.module';
import { EpisodeStageService } from '@cms/game/episode-stage/episode-stage.service';
import { ContentService } from '@cms/game/content/content.service';
import { CodewordClueService } from '@cms/game/codeword-clue/codeword-clue.service';
import { AnswerValidatorService } from '@cms/game/answer-validator/answer-validator.service';
import { EpisodeManagementController } from '@cms/game/episode-management.controller';
import { EpisodeMapper } from '@cms/game/episode/episode.mapper';
import { TextService } from '@cms/game/text/text.service';
import { StudentRepository } from '@cms/user/student/student.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CodewordClueRepository,
      ContentRepository,
      EpisodeRepository,
      EpisodeStageRepository,
      EpisodeStateRepository,
      TextRepository,
      AnswerValidatorRepository,
      StudentRepository,
    ]),
  ],
  controllers: [GameController, EpisodeManagementController],
  providers: [
    EpisodeService,
    EpisodeStateService,
    EpisodeStageService,
    ContentService,
    CodewordClueService,
    AnswerValidatorService,
    EpisodeMapper,
    TextService,
  ],
})
export class GameModule {}
