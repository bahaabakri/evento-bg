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
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // We'll create this next
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configure Passport
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get secret from env
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60m' }, // Get expiry from env
      }),
    }),
  ],
  controllers: [AuthUserController, AuthAdminController],
  providers: [UserService, OtpService, AuthService, MailService, JwtStrategy]
})
export class AuthModule {}
