import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/request/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/request/verfiy-user.dto';
import { AuthService } from './auth.service';
import Serialize from 'src/decorators/serialize.decorator';
import { UserResponseDto } from './dto/response/user-response.dto';
import { GuestGuard } from './guards/guest.guard';


@Serialize(UserResponseDto)
@UseGuards(GuestGuard)
@Controller('auth')
export class AuthUserController {
    constructor(private _authService:AuthService) {}
    
    @Post('loginRegister')
    async createOrLogin(@Body() body:CreateLoginDto) {
        // Logic to create a new user
        return this._authService.createLoginUser(body)
    }

    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto) {
        const res = await this._authService.verifyUser(email, otp)
        return res
    }
}
