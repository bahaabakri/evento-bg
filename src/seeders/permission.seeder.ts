import { Permission } from '@/modules/permissions/permission.entity';
import { PERMISSIONS_MAP } from '@/modules/permissions/permissions-map';
import { CreatePermissionDto } from '@/modules/permissions/dto/request/create-permission.dto';
import { PermissionsService } from '@/modules/permissions/permissions.service';

export async function permissionSeeder(permissionsService: PermissionsService) {

  for (const [moduleName, actions] of Object.entries(PERMISSIONS_MAP)) {
    for (const actionName of actions) {
      const dto: CreatePermissionDto = {
        moduleName,
        actionName,
        description: `Allows ${actionName} on ${moduleName}`,
      };

      try {
        await permissionsService.createPermission(dto);
        console.log(`✅ Created permission: ${actionName}_${moduleName}`);
      } catch (err) {
        // Optional: ignore duplicates
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`⚪ Skipped existing permission: ${actionName}_${moduleName}`);
        } else {
          console.error(`❌ Failed to create permission ${actionName}_${moduleName}:`, err.message);
        }
      }
    }
  }

  console.log('✅ Permissions seeding complete');
}