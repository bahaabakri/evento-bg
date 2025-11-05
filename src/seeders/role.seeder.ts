import { Role } from '@/modules/roles/role.entity';
import { RolesService } from '@/modules/roles/roles.service';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import { BadRequestException } from '@nestjs/common';

export async function roleSeeder(
  rolesService: RolesService,
  permissionsService: PermissionsService,
): Promise<Role | undefined> {
  // Get all permissions
  const allPermissions = await permissionsService.getAllPermissions();
  const permissionsIds = allPermissions.map((p) => p.id);

  let superAdminRole: Role;

  try {
    // Try creating the role
    const returnedData = await rolesService.createRole({
      name: 'super_admin',
      description: 'Full access to all system features',
      permissionsIds,
    });
    superAdminRole = returnedData.role;
    console.log('✅ Super Admin role created successfully!');
  } catch (err) {
    if (err instanceof BadRequestException) {
      console.log('⚠️ Super Admin role already exists → Skipping creation.');
      // If role already exists, fetch it
      superAdminRole = await rolesService.getRoleByName('super_admin');

      if (!superAdminRole) {
        console.error('❌ Super Admin role exists but cannot be found!');
        return;
      }

      // 🔹 Sync any new permissions with the existing super admin role
      const existingPermissionIds = superAdminRole.permissions.map((p) => p.id);
      const missingPermissionIds = permissionsIds.filter(
        (id) => !existingPermissionIds.includes(id),
      );

      if (missingPermissionIds.length > 0) {
        await rolesService.assignPermissionsToRole({permissionsIds: [...existingPermissionIds, ...missingPermissionIds]}, superAdminRole.id);
        console.log(`✅ Added ${missingPermissionIds.length} new permission(s) to Super Admin role.`);
      } else {
        console.log('⚪ Super Admin role already has all permissions.');
      }
    } else {
      console.error('❌ Failed to create super admin role:', err);
      return;
    }
  }

  return superAdminRole;
}
