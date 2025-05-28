import {Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "../../users/user.service";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class CurrentUserMiddleware implements NestMiddleware {

    constructor(private _userService: UserService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = (req as any).session || {};
        if (userId) {
        const user = await this._userService.findUserById(userId);
        if (user) {
            req.currentUser = user;
        }
        }
        next();
    }
}