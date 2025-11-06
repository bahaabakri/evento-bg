import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserAdminController } from './user-admin.controller';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UserController, UserAdminController],
    providers: [UserService, RolesService]
})
export class UserModule {}