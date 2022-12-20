import { Injectable, NotFoundException } from '@nestjs/common';
import { CodewordClue } from '@cms/game/codeword-clue/codeword-clue.entity';
import { EpisodeState } from '@cms/game/episode-state/episode-state.entity';
import { EpisodeStateRepository } from '@cms/game/episode-state/episode-state.repository';
import { _ } from '@cms/utilities/lodash';
import { UpdateClueDto } from '@cms/game/codeword-clue/codeword-clue.dto';
import { CodewordClueRepository } from '@cms/game/codeword-clue/codeword-clue.repository';

@Injectable()
export class CodewordClueService {
  constructor(
    private readonly stateRepo: EpisodeStateRepository,
    private readonly codewordClueRepo: CodewordClueRepository,
  ) {}

  public async selectRandomClue(
    clues: CodewordClue[],
    state: EpisodeState,
  ): Promise<CodewordClue> {
    if (state.shownCodewordClue) return state.shownCodewordClue;
    const clue = clues[_.random(0, clues.length)];
    state.shownCodewordClue = clue;
    await this.stateRepo.save(state);
    return clue;
  }

  public async updateClue(data: UpdateClueDto): Promise<CodewordClue> {
    const clue = await this.assertClueExists(data.id);

    clue.clue = data.clue;

    await this.codewordClueRepo.save(clue);

    return this.codewordClueRepo.getPopulatedClue(clue.id);
  }

  private assertClueExists(id: number): Promise<CodewordClue> {
    return this.codewordClueRepo.findOneOrFail(id).catch(() => {
      throw new NotFoundException('Clue not found');
    });
  }
}
