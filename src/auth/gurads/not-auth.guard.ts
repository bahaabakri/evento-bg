import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export default class NotAuthGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        const request = context.switchToHttp().getRequest();
        console.log(request.session.userId);
        
        return !(!!request.session.userId);
    }
}