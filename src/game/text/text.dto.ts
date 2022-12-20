import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTextDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
