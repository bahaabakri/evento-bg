import { Module } from '@nestjs/common';
import {AuthUserController } from './auth-user.controller';
import { UserService } from '@/modules/users/user.service';
import { AuthService } from './auth.service';
import { OtpService } from '@/modules/otp/otp.service';
import { MailService } from '@/services/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '@/modules/otp/otp.entity';
import { User } from '@/modules/users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthAdminController } from './auth-admin.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // We'll create this next
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configure Passport
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get secret from env
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d' }, // Get expiry from env
      }),
    }),
    HttpModule
  ],
  controllers: [AuthUserController, AuthAdminController],
  providers: [UserService, OtpService, AuthService, MailService, JwtStrategy]
})
export class AuthModule {}
