import {UseInterceptors} from '@nestjs/common'
import SerializeInterceptor from 'src/interceptors/serialize.interceptor'
import { ClassType } from 'src/types/types'
export default function Serialize(dto:ClassType<any>) {
    return UseInterceptors(new SerializeInterceptor(dto))
}