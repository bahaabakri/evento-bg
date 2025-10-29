import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { VerifyUserDto } from '@/modules/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from '@/decorators/serialize.decorator';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { GuestGuard } from './guards/guest.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResendOtpDto } from './dto/request/resend-otp.dtp';
import { LoginDto } from './dto/request/login.dto';
import { CreateUpdateAdminDto } from '../users/dto/request/create-update-admin.dto';

@Serialize(AuthResponseDto)
@UseGuards(GuestGuard)
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private _authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login admin' })
  async loginAdmin(@Body() body: LoginDto) {
    // Logic to login as an admin
    return this._authService.loginAdmin(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new admin' })
  async createAdmin(@Body() body: CreateUpdateAdminDto) {
    // Logic to create a new admin
    return this._authService.registerAdmin(body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify admin by 2fa' })
  async verifyAdmin(@Body() { email, otp }: VerifyUserDto) {
    const res = await this._authService.verifyAdmin(email, otp);
    return res;
  }
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend Otp' })
  async resendOtp(@Body() { email }: ResendOtpDto) {
    const res = await this._authService.resendAdminOtp(email);
    return res;
  }
}
