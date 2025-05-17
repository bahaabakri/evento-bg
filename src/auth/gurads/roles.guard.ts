import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/users/decorators/roles.decorator";
import { Role } from "src/users/roles.enum";
import { User } from "src/users/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private _reflector: Reflector) {}
    private readonly hierarchyOrder: Record<Role, number> = {
        [Role.USER]: 0,
        [Role.ADMIN]: 1,
        [Role.MODERATOR]: 2,
        [Role.SUPER_ADMIN]: 3,
        };
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this._reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // no role is required
        if(!requiredRoles) {
            return true;
        }
        const {currentUser}: {currentUser:User} = context.switchToHttp().getRequest();
        // no authenticated user
        if(!currentUser) {
            return false;
        }
        // check if the user has the required role
        const userRoleOrder = this.hierarchyOrder[currentUser.role];
        return requiredRoles.some(requiredRole => {
            return userRoleOrder >= this.hierarchyOrder[requiredRole]; // or === if you want exact match
        });
    }
}   