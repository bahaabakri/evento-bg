import 'reflect-metadata';
import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { userSeeder } from './user.seeder';
import { permissionSeeder } from './permission.seeder';
// import { roleSeeder } from './role.seeder';
// import { permissionSeeder } from './permission.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  const dbName = configService.get<string>('DB_NAME');
  console.log('✅ Connected to DB:', dbName);

  // Run your individual seeders
  await permissionSeeder(dataSource);
  await userSeeder(dataSource);
  // await roleSeeder(dataSource);

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
