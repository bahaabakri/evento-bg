import { DataSource } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { UserStatus } from '@/modules/users/user-status.enum';
import { UserType } from '@/modules/users/user-type.enum';

export async function userSeeder(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  const existing = await repo.findOne({ where: { email: 'test@gmail.com' } });

  if (existing) {
    console.log('⚠️ Super admin already exists');
    return;
  }

  const user = repo.create({
    firstname: 'Super Admin',
    lastname: 'Seeder',
    email: 'test@gmail.com',
    phone: '0000000000',
    isVerified: true,
    status: UserStatus.APPROVED,
    userType: UserType.ADMIN,
  });

  await repo.save(user);
  console.log('✅ Super admin seeded successfully');
}
