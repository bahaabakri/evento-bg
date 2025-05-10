import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configure static file serving using ServeStaticModule
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  // configure cookie session
  app.use(cookieSession({
    keys:['userId']
  }))
  // configure global pips
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  // cors options
  const corsOptions:CorsOptions = {
    origin: 'http://localhost:5173/',
    credentials: true
  }
  app.enableCors(corsOptions)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();