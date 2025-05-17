import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export default class NotUserAuthGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        const request = context.switchToHttp().getRequest();       
        return !(!!request.session.userId);
    }
}