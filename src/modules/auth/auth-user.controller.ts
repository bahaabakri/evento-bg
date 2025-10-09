import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/modules/auth/dto/request/create-login.dto';
import { VerifyUserDto } from 'src/modules/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from 'src/decorators/serialize.decorator';
import { GuestGuard } from './guards/guest.guard';
import { AuthResponseDto } from './dto/response/auth-response.dto';


@Serialize(AuthResponseDto)
@UseGuards(GuestGuard)
@Controller('auth')
export class AuthUserController {
    constructor(private _authService:AuthService) {}
    
    @Post('loginRegister')
    async createOrLogin(@Body() body:CreateLoginDto) {
        // Logic to create a new user
        return this._authService.registerLoginUser(body)
    }

    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto) {
        const res = await this._authService.verifyUser(email, otp)
        return res
    }

    @Post('google-login')
    async googleLogin(@Body('token') token: string) {
        return this._authService.loginWithGoogle(token);
    }
}
