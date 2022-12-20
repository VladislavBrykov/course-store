import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '@cms/auth/jwt/jwt-acces-token.guard';
import { RoleGuard } from '@cms/auth/role/role.guard';
import { Role } from '@cms/auth/role/role.decorator';
import { UserRole } from '@cms/utilities/user-role.enum';
import { EpisodeService } from '@cms/game/episode/episode.service';
import { EpisodeMapper } from '@cms/game/episode/episode.mapper';
import {
  CreateEpisodeDto,
  UpdateEpisodeDto,
} from '@cms/game/episode/episode.dto';
import {
  AddStageDto,
  UpdateStageDto,
} from '@cms/game/episode-stage/episode-stage.dto';
import { EpisodeStageService } from '@cms/game/episode-stage/episode-stage.service';
import { CodewordClueService } from '@cms/game/codeword-clue/codeword-clue.service';
import { TextService } from '@cms/game/text/text.service';
import { UpdateTextDto } from '@cms/game/text/text.dto';
import { UpdateClueDto } from '@cms/game/codeword-clue/codeword-clue.dto';

@Controller('episode-remove-management')
export class EpisodeManagementController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly episodesMapper: EpisodeMapper,
    private readonly episodeStageService: EpisodeStageService,
    private readonly codewordClueService: CodewordClueService,
    private readonly textService: TextService,
  ) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Get('get-episodes')
  public async getEpisodes() {
    return this.episodeService
      .getPopulatedEpisodes()
      .then((episodes) =>
        episodes.map((ep) => this.episodesMapper.mapPopulatedEpisode(ep)),
      );
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Post('create-episode-remove')
  public async createEpisode(@Body() newEpisode: CreateEpisodeDto) {
    return this.episodeService
      .createEpisode(newEpisode)
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Patch('update-episode-remove')
  public async updateEpisode(@Body() data: UpdateEpisodeDto) {
    return this.episodeService
      .updateEpisode(data)
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Post('add-stage')
  public async addStage(@Body() data: AddStageDto) {
    return this.episodeStageService
      .addStage(data)
      .then(() => this.episodeService.getPopulatedEpisode(data.episodeId))
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Patch('update-stage')
  public async updateStage(@Body() data: UpdateStageDto) {
    return this.episodeStageService
      .updateStage(data)
      .then((stg) => this.episodeService.getPopulatedEpisode(stg.episode.id))
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Patch('update-clue')
  public async updateClue(@Body() data: UpdateClueDto) {
    return this.codewordClueService
      .updateClue(data)
      .then((clue) =>
        this.episodeService.getPopulatedEpisode(
          clue.content.episodeStage.episode.id,
        ),
      )
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Role([UserRole.TEACHER, UserRole.ADMIN, UserRole.SCREEN_WRITER])
  @Patch('update-text')
  public async updateText(@Body() data: UpdateTextDto) {
    return this.textService
      .updateText(data)
      .then((text) =>
        this.episodeService.getPopulatedEpisode(
          text.content.episodeStage.episode.id,
        ),
      )
      .then((ep) => this.episodesMapper.mapPopulatedEpisode(ep));
  }
}
