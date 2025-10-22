import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // create a child context for seeding
  const seedApp = await NestFactory.createApplicationContext(SeedModule);
  const seeder = seedApp.get(SeedService);

  await seeder.runAll();

  await seedApp.close();
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
