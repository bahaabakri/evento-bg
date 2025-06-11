import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './events/event.entity';
import { UploadIntent } from './upload-image/upload-intent.entity';
import { UploadImage } from './upload-image/upload-image.entity';
import { UploadImageModule } from './upload-image/upload-image.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './users/user.module';
import { Otp } from './otp/otp.entity';
import { User } from './users/user.entity';
import { HeroModule } from './hero/hero.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './users/user.service';
import { APP_PIPE } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
const isProduction = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    EventsModule,
    UserModule,
    UploadImageModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally available
      envFilePath: `.env.${process.env.NODE_ENV}`, // Load environment variables from .env file
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME'),
        entities: [EventEntity, UploadIntent, UploadImage, User, Otp],
        synchronize: true
      })
    }),
    TypeOrmModule.forFeature([User]),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        auth: {
          user: 'dc3f149b7f32f7',
          pass: 'f71e7a0e66fa56',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'baha@innovationfactory.biz',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    HeroModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      // this middleware will be used in order to handle cors
      // and allow requests from the frontend running on localhost:5173
      const cors = require('cors');
      const corsOptions: CorsOptions = {
        origin: 'http://localhost:5173',
        credentials: true,
      };
      consumer
        .apply(cors(corsOptions))
        .forRoutes('*');
    }
}
