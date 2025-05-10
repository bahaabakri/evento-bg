import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpService } from 'src/otp/otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Otp } from 'src/otp/otp.entity';
import { MailService } from 'src/services/mail.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import CurrentUserInterceptor from './interceptors/current-user.interceptor';

@Module({
    imports: [TypeOrmModule.forFeature([User, Otp])],
    controllers: [UserController],
    providers: [UserService, OtpService, MailService, 
        {
            provide: APP_INTERCEPTOR,
            useClass: CurrentUserInterceptor
          }
    ]
})
export class UserModule {}