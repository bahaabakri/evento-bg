import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export default class NotAdminAuthGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        const request = context.switchToHttp().getRequest();       
        return !(!!request.session.adminId);
    }
}