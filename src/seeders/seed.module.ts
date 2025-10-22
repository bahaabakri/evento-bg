import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/user.entity';
import { Permission } from '@/modules/permissions/permission.entity';
import { UserService } from '@/modules/users/user.service';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import { SeedService } from './seed.service';
import { DataSourceModule } from '@/modules/datasource/datasource.module';
import { Role } from '@/modules/roles/role.entity';
import { RolesService } from '@/modules/roles/roles.service';
@Module({
  imports: [
    DataSourceModule,
    TypeOrmModule.forFeature([User, Permission, Role]),
  ],
  providers: [
    SeedService,
    UserService,
    PermissionsService,
    RolesService
  ],
})
export class SeedModule {}
