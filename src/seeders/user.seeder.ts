import { UserService } from '@/modules/users/user.service';

export async function userSeeder(userService: UserService) {

  try {
    await userService.createSuperAdmin()
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
  }
  console.log('✅ Super admin seeded successfully');
}
