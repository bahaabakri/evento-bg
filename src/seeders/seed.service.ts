import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';
import { permissionSeeder } from './permission.seeder';
import { userSeeder } from './user.seeder';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import { RolesService } from '@/modules/roles/roles.service';
import { roleSeeder } from './role.seeder';
@Injectable()
export class SeedService {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly userService: UserService,
    private readonly rolesService: RolesService
  ) {}

  async runAll() {
    console.log('🚀 Running seeders...');
    await permissionSeeder(this.permissionsService);
    const createdRole = await roleSeeder(this.rolesService, this.permissionsService)
    if(createdRole) {
      await userSeeder(this.userService, this.rolesService, createdRole);
    } else {
      console.error('⚠️ Assigning role to super admin NOT completed because no role has been created');
    }
    console.log('✅ All seeders completed successfully');
  }
}
