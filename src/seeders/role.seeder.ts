import { Permission } from '@/modules/permissions/permission.entity';
import { PERMISSIONS_MAP } from '@/modules/permissions/permissions-map';
import { CreatePermissionDto } from '@/modules/permissions/dto/request/create-permission.dto';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import { RolesService } from '@/modules/roles/roles.service';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@/modules/roles/role.entity';

export async function roleSeeder(
  rolesService: RolesService,
  permissionsService: PermissionsService,

) {
  // Get all permissions
  const allPermissions = await permissionsService.getAllPermissions();
  const permissionsIds = allPermissions.map((p) => p.id);
  try {
    // Create Super Admin role
    const returnedData = await rolesService.createRole({
      name: 'super_admin',
      description: 'Full access to all system features',
      permissionsIds,
    });
    console.log('✅ Super Admin role created successfully!');
    return returnedData.role
  } catch (err) {
    if (err instanceof BadRequestException) {
      console.log('⚠️ Super Admin role already exists → Skipping creation.');
    }
  }
}
