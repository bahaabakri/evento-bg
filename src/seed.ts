import 'reflect-metadata'; // required by TypeORM
import { config } from 'dotenv';
config(); // load .env automatically

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Role } from '@/modules/users/roles.enum';
import { Status } from '@/modules/users/status.enum';

async function bootstrap() {
  // create NestJS application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  // sanity check
  const dbName = configService.get<string>('DB_NAME');
  if (!dbName) {
    console.error('❌ DB_NAME is not set in your environment variables');
    process.exit(1);
  }
  console.log('✅ Connecting to DB:', dbName);

  const repo = dataSource.getRepository(User);

  // check if user already exists
  const existing = await repo.findOne({ where: { email: 'test@gmail.com' } });
  if (!existing) {
    const user = repo.create({
      firstname: 'Super Admin',
      lastname: 'Seeder',
      email: 'test@gmail.com',
      phone: '0000000000',
      isVerified: true,
      role: Role.SUPER_ADMIN,
      status: Status.APPROVED,
    });

    await repo.save(user);
    console.log('✅ User seeded!');
  } else {
    console.log('⚠️ User already exists');
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
