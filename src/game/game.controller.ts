import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EpisodeService } from '@cms/game/episode/episode.service';
import { JwtAccessTokenGuard } from '@cms/auth/jwt/jwt-acces-token.guard';
import { Role } from '@cms/auth/role/role.decorator';
import { UserRole } from '@cms/utilities/user-role.enum';
import { RoleGuard } from '@cms/auth/role/role.guard';
import { UserId } from '@cms/auth/current-user.decorator';
import { Trait } from '@cms/utilities/trait.enum';
import { EpisodeStageService } from '@cms/game/episode-stage/episode-stage.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly episodeService: EpisodeService,
    private episodeStageService: EpisodeStageService,
  ) {}

  @Post('set-episode-remove')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.STUDENT)
  async setGameEpisode(
    @UserId() userId: number,
    @Body('codeword') codeword: string,
  ): Promise<number> {
    return this.episodeService.setEpisode(codeword, userId);
  }

  @Post('next')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.STUDENT)
  async next(
    @UserId() userId: number,
    @Body('stateId') stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    return this.episodeStageService.nextStage(userId, stateId);
  }

  @Post('start-episode-remove-story')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.STUDENT)
  async startEpisodeStory(
    @UserId() userId: number,
    @Body('stateId') stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    return this.episodeStageService.startTheStory(userId, stateId);
  }

  @Post('show-challenge')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.STUDENT)
  async showChallenge(
    @UserId() userId: number,
    @Body('stateId') stateId: number,
  ): Promise<{ trait: Trait; text: string }> {
    return this.episodeStageService.showChallenge(userId, stateId);
  }

  @Post('answer')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role(UserRole.STUDENT)
  async answer(
    @UserId() userId: number,
    @Body('stateId') stateId: number,
    @Body('answer') answer: string,
  ): Promise<{ trait: Trait; text: string }> {
    return this.episodeStageService.answer(userId, stateId, answer);
  }
}
