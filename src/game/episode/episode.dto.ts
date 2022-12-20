import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Lang } from '@cms/utilities/lang.enum';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Lang)
  @IsNotEmpty()
  lang: Lang;

  @IsString()
  @IsNotEmpty()
  codeword: string;

  @IsString({ each: true })
  @IsNotEmpty()
  storyStages: string[];

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  validator: string;

  @IsString()
  @IsNotEmpty()
  success: string;

  @IsString({ each: true })
  @IsNotEmpty()
  errorStages: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  clues: string[];
}

export class UpdateEpisodeDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  @IsString()
  @IsNotEmpty()
  codeword: string;

  @IsString()
  @IsNotEmpty()
  validator: string;
}
