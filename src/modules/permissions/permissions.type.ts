import { CreatePermissionDto } from "./dto/request/create-permission.dto";

export type OddPermission = CreatePermissionDto &  {
    slug:string
}