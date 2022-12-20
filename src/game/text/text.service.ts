import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTextDto } from '@cms/game/text/text.dto';
import { TextRepository } from '@cms/game/text/text.repository';
import { Text } from '@cms/game/text/text.entity';

@Injectable()
export class TextService {
  constructor(private readonly textRepo: TextRepository) {}

  public async updateText(data: UpdateTextDto): Promise<Text> {
    const text = await this.assertTextExists(data.id);

    text.text = data.text;

    await this.textRepo.save(text);

    return this.textRepo.getPopulatedText(text.id);
  }

  private assertTextExists(id: number): Promise<Text> {
    return this.textRepo.findOneOrFail(id).catch(() => {
      throw new NotFoundException('Text not found');
    });
  }
}
