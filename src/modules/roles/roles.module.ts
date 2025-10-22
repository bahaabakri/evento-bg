import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Type } from "class-transformer";
import { Role } from "./role.entity";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { UserService } from "../users/user.service";
import { PermissionsService } from "../permissions/permissions.service";
import { Permission } from "../permissions/permission.entity";
import { User } from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, User])],
    controllers: [RolesController],
    providers: [RolesService, PermissionsService, UserService],
})
export class RolesModule {}