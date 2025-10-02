// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles.enum';
// This decorator is used to set the roles metadata for a route handler.
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);