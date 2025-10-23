import { Role } from '@/modules/roles/role.entity';
import { RolesService } from '@/modules/roles/roles.service';
import { User } from '@/modules/users/user.entity';
import { UserService } from '@/modules/users/user.service';

export async function userSeeder(userService: UserService, rolesService:RolesService, createdRole: Role) {
  let createdAdmin: User;
  try {
    createdAdmin = await userService.createSuperAdmin();
    console.log('✅ Super Admin has been created!');
    // Assign super admin role to super admin user
    try {
      await rolesService.assignSuperAdminRoleToSuperAdmin(
        createdAdmin.id,
        createdRole.id,
      );
          console.log('✅ Super Admin role has been assigned to super admin!');
    } catch (err) {
      console.log('⚠️ Super Admin role assignment not completed');
    }
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
  }
  console.log('✅ Super admin seeded successfully');
}
