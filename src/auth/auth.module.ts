import { Module } from '@nestjs/common';
import {AuthUserController } from './auth-user.controller';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/services/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/otp/otp.entity';
import { User } from 'src/users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthAdminController } from './auth-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp])],
  controllers: [AuthUserController, AuthAdminController],
  providers: [UserService, OtpService, AuthService, MailService]
})
export class AuthModule {}
