import { Module } from '@nestjs/common';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
