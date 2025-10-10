import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configure static file serving using express.static
  const staticFilesPath = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(staticFilesPath));

  // Configure Swagger Doc
  const config = new DocumentBuilder()
    .setTitle('Evento APIs')
    .setDescription('This is the main documentation for eveto api')
    .setVersion('1.0')
    .addBearerAuth() // optional

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
