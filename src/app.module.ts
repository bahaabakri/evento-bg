import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './modules/events/event.entity';
import { UploadIntent } from './modules/upload-image/upload-intent.entity';
import { UploadImage } from './modules/upload-image/upload-image.entity';
import { UploadImageModule } from './modules/upload-image/upload-image.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './modules/users/user.module';
import { Otp } from './modules/otp/otp.entity';
import { User } from './modules/users/user.entity';
import { HeroModule } from './modules/hero/hero.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Hero } from './modules/hero/hero.entity';
import { TicketsModule } from './modules/tickets/tickets.module';
import { EventTicket } from './modules/tickets/ticket.entity';
import { PlanEntity } from './modules/plans/plan.entity';
import { PlansModule } from './modules/plans/plans.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Role } from './modules/roles/role.entity';
import { Permission } from './modules/permissions/permission.entity';
import { SeedModule } from './seeders/seed.module';
import { DataSourceModule } from './modules/datasource/datasource.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesService } from './modules/roles/roles.service';
import { RolesModule } from './modules/roles/roles.module';
const isProduction = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    EventsModule,
    TicketsModule,
    UserModule,
    PlansModule,
    UploadImageModule,
    ScheduleModule.forRoot(),
    DataSourceModule,
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        auth: {
          user: '8c39f8bb36c637',
          pass: 'dc639a4fd212f4',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'bahaa.bakri1995@gmail.com',
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
    SeedModule,
    PermissionsModule,
    RolesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // this middleware will be used in order to handle cors
    // and allow requests from the frontend running on localhost:5173
    const cors = require('cors');
    const corsOptions: CorsOptions = {
      origin: [
        'http://localhost:5172',
        'http://localhost:5174',
        'http://localhost:5173',
      ],
      credentials: true,
    };
    consumer.apply(cors(corsOptions)).forRoutes('*');
  }
}
