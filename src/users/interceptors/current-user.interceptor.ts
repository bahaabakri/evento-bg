import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserService } from "../user.service";

@Injectable()
export default class CurrentUserInterceptor implements NestInterceptor {

    constructor(private _userService: UserService) {}
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const {userId } = request.session || {}
        if (userId) {
            const user = await this._userService.findUserById(userId)
            if (user) {
                request.currentUser = user
            }
        }
        return next.handle()
    }
}