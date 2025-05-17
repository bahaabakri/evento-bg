import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
@Module({
  imports: [
    EventsModule,
    UserModule,
    UploadImageModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [EventEntity, UploadIntent, UploadImage, User, Otp],
      synchronize: true
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
          rejectUnauthorized: false, // <== ADD THIS LINE
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
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  // config currentUser middleware
  
    configure(consumer: MiddlewareConsumer) {
      // this middleware will be used to get the current admin from the requests coming from /admin route
      consumer
        .apply(CurrentAdminMiddleware)
        .forRoutes({ path: 'admin/*', method: 0 }); // 0 corresponds to RequestMethod.ALL
      // this middleware will be used to get the current user from the request
      consumer
        .apply(CurrentUserMiddleware)
        .exclude({ path: 'admin/*', method: 0 })
        .forRoutes('*');
    }
}
