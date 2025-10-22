import { Permission } from '@/modules/permissions/permission.entity';
import { PERMISSIONS_MAP } from '@/modules/permissions/permissions-map';
import { CreatePermissionDto } from '@/modules/permissions/dto/request/create-permission.dto';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import { RolesService } from '@/modules/roles/roles.service';

export async function roleSeeder(rolesService: RolesService,permissionsService: PermissionsService) {
    // Get all permissions
    const allPermissions = await permissionsService.getAllPermissions();
    const permissionsIds = allPermissions.map((p) => p.id);

    // Create Super Admin role
    await rolesService.createRole({
      name: 'super_admin',
      description: 'Full access to all system features',
      permissionsIds,
    });

    console.log('✅ Super Admin role created successfully!');
}