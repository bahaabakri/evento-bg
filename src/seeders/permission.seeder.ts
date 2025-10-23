import { Permission } from '@/modules/permissions/permission.entity';
import { ODD_PERMISSIONS, PERMISSIONS_MAP } from '@/modules/permissions/permissions-map';
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
  // ✅ Seed odd permissions
  for (const {moduleName, actionName, description, slug} of ODD_PERMISSIONS) {
    const dto: CreatePermissionDto = {
      moduleName,
      actionName,
      description,
      slug
    };
    try {
      await permissionsService.createPermission(dto);
      console.log(`✅ Created odd permission: ${slug}`);
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        console.log(`⚪ Skipped existing odd permission: ${slug}`);
      } else {
        console.error(`❌ Failed to create odd permission ${slug}:`, err.message);
      }
    }
  }
  console.log('✅ Permissions seeding complete');
}