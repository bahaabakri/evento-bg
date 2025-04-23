import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { ClassType } from "src/types/types";
// import { GetUserDto } from "src/users/dtos/get-user.dto";

export default class SerializeInterceptor implements NestInterceptor {

    constructor(private _Dto: ClassType<any>) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // console.log('Before the request is handle')
        return next.handle().pipe(
            map((data:any) => {
                return plainToInstance(this._Dto, data, {
                    excludeExtraneousValues: true
                })
            }) 
        )
    }
}