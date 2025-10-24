import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionsService } from '../permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('You do not have any assigned roles');
    }

    const userPermissions = new Set(
      user.roles.flatMap((role) => role.permissions.map((p) => p.slug)),
    );

    const missingPermissions = requiredPermissions.filter(
      (perm) => !userPermissions.has(perm),
    );

    if (missingPermissions.length > 0) {
      const missingPermission =
        await this.permissionsService.getPermissionBySlug(
          missingPermissions[0],
        );
      const { module, action } = missingPermission;
      throw new ForbiddenException(
        `You are not allowed to perform the ${action} action on ${module}`,
      );
    }

    return true;
  }
}
