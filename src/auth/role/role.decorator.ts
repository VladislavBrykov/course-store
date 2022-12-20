import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@cms/utilities/user-role.enum';

export const Role = (role: UserRole | Array<UserRole>) =>
  SetMetadata('role', Array.isArray(role) ? role : [role]);
