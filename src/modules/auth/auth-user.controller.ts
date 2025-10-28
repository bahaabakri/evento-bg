import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from '@/modules/auth/dto/request/create-login.dto';
import { VerifyUserDto } from '@/modules/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from '@/decorators/serialize.decorator';
import { GuestGuard } from './guards/guest.guard';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import GoogleLoginDto from './dto/request/google-login.dto';
import { ResendOtpDto } from './dto/request/resend-otp.dtp';

@Serialize(AuthResponseDto)
@UseGuards(GuestGuard)
@Controller('auth')
export class AuthUserController {
  constructor(private _authService: AuthService) {}

  @Post('loginRegister')
  @ApiOperation({ summary: 'Register a new user or login' })
  async createOrLogin(@Body() body: CreateLoginDto) {
    // Logic to create a new user
    return this._authService.registerLoginUser(body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user by 2fa' })
  async verifyUser(@Body() { email, otp }: VerifyUserDto) {
    const res = await this._authService.verifyUser(email, otp);
    return res;
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend Otp' })
  async resendOtp(@Body() { email }: ResendOtpDto) {
    const res = await this._authService.resendUserOtp(email);
    return res;
  }

  @Post('google-login')
  @ApiOperation({ summary: 'Login with google' })
  async googleLogin(@Body() { token }: GoogleLoginDto) {
    return this._authService.loginWithGoogle(token);
  }
}
