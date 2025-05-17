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
  // Session for regular users
  app.use(
    (req, res, next) => {
      if (!req.originalUrl.startsWith('/admin')) {
        cookieSession({
          name: 'user_session',
          keys: ['user_key'],
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })(req, res, next);
      } else {
        next();
      }
    }
  );

  // Session for admins
  app.use(
    (req, res, next) => {
      if (req.originalUrl.startsWith('/admin')) {
        cookieSession({
          name: 'admin_session',
          keys: ['admin_key'],
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })(req, res, next);
      } else {
        next();
      }
    }
  );
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