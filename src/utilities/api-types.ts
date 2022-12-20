import { Request } from 'express';

import { UserRole } from './user-role.enum';
export type UserProfileData = {
  name: string;
  email: string;
  role: UserRole;
  playerName?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type TokenPayload = {
  id: number;
  role: UserRole;
};

export interface UserData extends Request {
  user: TokenPayload;
}

export type CodewordClueData = {
  clue: string;
  contentId: number;
};
