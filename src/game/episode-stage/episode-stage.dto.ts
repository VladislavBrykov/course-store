import { Trait } from '@cms/utilities/trait.enum';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddStageDto {
  @IsInt()
  @IsNotEmpty()
  episodeId: number;

  @IsNotEmpty()
  @IsEnum(Trait)
  trait: Trait;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString({ each: true })
  @IsOptional()
  clues?: string[];

  @IsInt()
  @IsOptional()
  nextStageId?: number;

  @IsInt()
  @IsOptional()
  rollbackStageId?: number;
}

export class UpdateStageDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsOptional()
  nextStageId?: number;

  @IsInt()
  @IsOptional()
  rollbackStageId?: number;
}
