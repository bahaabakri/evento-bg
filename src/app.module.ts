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
import CurrentUserMiddleware from './auth/middlewares/current-user.middleware';
import { UserService } from './users/user.service';
import CurrentAdminMiddleware from './auth/middlewares/current-admin.middleware';
import { APP_PIPE } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as express from 'express';
import * as cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [EventEntity, UploadIntent, UploadImage, User, Otp],
    //   synchronize: true
    // }),
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
  // Log the CWD when the app starts
  // console.log('Current Working Directory:', process.cwd());
  // // Log the intended static path
  // console.log('Static files path:', join(process.cwd(), 'uploads'));
  //   // Configure static file serving using express.static
    //   const staticFilesPath = join(process.cwd(), 'uploads');
    // console.log('MiddlewareConsumer: Serving static files from:', staticFilesPath)
    //   consumer
    //   .apply(express.static(join(process.cwd(), 'uploads')))
    //   .forRoutes({ path: '/uploads/*', method: RequestMethod.GET });
      // console.log(`Current directory: ${join(process.cwd(), 'uploads')}`);


      // Configure cookie session for admin and user sessions
      // Session for admins
      consumer.apply(cookieSession({
        name: 'admin_session',
        keys: ['admin_key'],
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        secure: isProduction,       // 🔒 true only in prod (HTTPS)
        sameSite: isProduction ? 'none': 'lax', // 🛡️ 'none' only in prod
      }))
      .forRoutes({ path: 'admin/*', method: RequestMethod.ALL }); // 0 corresponds to RequestMethod.ALL
      
      
      // Session for regular users
      consumer.apply(cookieSession(
        {
            name: 'user_session',
            keys: ['user_key'],
            maxAge: 24 * 60 * 60 * 1000, // 1 day,
            secure: isProduction,       // 🔒 true only in prod (HTTPS)
            sameSite: isProduction ? 'none': 'lax', // 🛡️ 'none' only in prod
          }
      ))
      .exclude({ path: 'admin/*', method: RequestMethod.ALL })
      .forRoutes('*');

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

      
      // config currentUser middleware
      // this middleware will be used to get the current admin from the requests coming from /admin route
      consumer
        .apply(CurrentAdminMiddleware)
        .forRoutes({ path: 'admin/*', method: RequestMethod.ALL }); // 0 corresponds to RequestMethod.ALL
      // this middleware will be used to get the current user from the request
      consumer
        .apply(CurrentUserMiddleware)
        .exclude({ path: 'admin/*', method: RequestMethod.ALL })
        .forRoutes('*');
    }
}
