import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/request/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from 'src/decorators/serialize.decorator';
import { UserResponseDto } from './dto/response/user-response.dto';
import { GuestGuard } from './guards/guest.guard';
import { CreateAdminDto } from './dto/request/create-admin.dto';

@Serialize(UserResponseDto)
@UseGuards(GuestGuard)
@Controller('admin/auth')
export class AuthAdminController {
    constructor(private _authService:AuthService) {}
    
    @Post('login')
    async loginAdmin(@Body() body:CreateLoginDto) {
        // Logic to login as an admin
        return this._authService.loginAdmin(body)
    }

    @Post('register')
    async createAdmin(@Body() body:CreateAdminDto) {
        // Logic to create a new admin
        return this._authService.registerAdmin(body)
    }
    
    @Post('verify')
    async verifyAdmin(@Body() {email, otp}: VerifyUserDto) {
        const res = await this._authService.verifyAdmin(email, otp)
        return res
    }
}
