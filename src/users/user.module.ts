import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpService } from 'src/otp/otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Otp } from 'src/otp/otp.entity';
import { MailService } from 'src/services/mail.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Otp])],
    controllers: [UserController],
    providers: [UserService, OtpService, MailService]
})
export class UserModule {}