import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware } from "@nestjs/common";

import { UserService } from "../../users/user.service";
import { NextFunction } from "express";

@Injectable()
export default class CurrentAdminMiddleware implements NestMiddleware {

    constructor(private _userService: UserService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const { adminId } = (req as any).session || {};
        if (adminId) {
        const user = await this._userService.findUserById(adminId);
        if (user) {
            (req as any).currentAdmin = user;
        }
        }
        next();
    }
}