import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateClueDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  clue: string;
}
