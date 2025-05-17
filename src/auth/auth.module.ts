import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/services/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/otp/otp.entity';
import { User } from 'src/users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp])],
  controllers: [AuthController],
  providers: [UserService, OtpService, AuthService, MailService]
})
export class AuthModule {}
