import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { UserRole } from '@cms/utilities/user-role.enum';

export class UpdateUserProfileDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  playerName?: string;
}

export class CreateUserProfileDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(5, 20)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsAlphanumeric()
  playerName?: string;
}

export class UpdateUserPasswordDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(5, 20)
  password: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
