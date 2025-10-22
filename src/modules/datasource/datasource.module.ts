import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { Hero } from '../hero/hero.entity';
import { Otp } from '../otp/otp.entity';
import { Permission } from '../permissions/permission.entity';
import { PlanEntity } from '../plans/plan.entity';
import { Role } from '../roles/role.entity';
import { EventTicket } from '../tickets/ticket.entity';
import { UploadImage } from '../upload-image/upload-image.entity';
import { UploadIntent } from '../upload-image/upload-intent.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally available
      envFilePath: `.env.${process.env.NODE_ENV}`, // Load environment variables from .env file
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME'),
        entities: [
          EventEntity,
          EventTicket,
          UploadIntent,
          UploadImage,
          User,
          Otp,
          Hero,
          PlanEntity,
          Permission,
          Role,
        ],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DataSourceModule {}
