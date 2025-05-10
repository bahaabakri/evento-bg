import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      template: './send-otp', // points to templates/otp.hbs
      context: { 
        logoUrl: 'http://localhost:3000/uploads/logo/logo.png',
        primaryColor: '#C21E56',
        otp: otp,
        expiryMinutes: 5,
        year: new Date().getFullYear(),
      },
    });
  }
}