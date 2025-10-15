import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from '@/modules/auth/dto/request/create-login.dto';
import { VerifyUserDto } from '@/modules/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from '@/decorators/serialize.decorator';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { GuestGuard } from './guards/guest.guard';
import { CreateAdminDto } from './dto/request/create-admin.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Serialize(AuthResponseDto)
@UseGuards(GuestGuard)
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private _authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login admin' })
  async loginAdmin(@Body() body: CreateLoginDto) {
    // Logic to login as an admin
    return this._authService.loginAdmin(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new admin' })
  async createAdmin(@Body() body: CreateAdminDto) {
    // Logic to create a new admin
    return this._authService.registerAdmin(body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify admin by 2fa' })
  async verifyAdmin(@Body() { email, otp }: VerifyUserDto) {
    const res = await this._authService.verifyAdmin(email, otp);
    return res;
  }
}
