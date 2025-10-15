import {UseInterceptors} from '@nestjs/common'
import SerializeInterceptor from '@/interceptors/serialize.interceptor'
import { ClassType } from '@/types/types'
export default function Serialize(dto:ClassType<any>) {
    return UseInterceptors(new SerializeInterceptor(dto))
}