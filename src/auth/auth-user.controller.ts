import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/request/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/request/verfiy-user.dto';
import { UserAuthGuard } from 'src/auth/gurads/user-auth.guard';
import { AuthService } from './auth.service';
import NotUserAuthGuard from 'src/auth/gurads/not-user-auth.guard';
import Serialize from 'src/decorators/serialize.decorator';
import { UserResponseDto } from './dto/response/user-response.dto';

@Controller('auth')
export class AuthUserController {
    constructor(private _authService:AuthService) {}
    /////////////////////////// Authenticated Routes /////////////////////////
    @UseGuards(UserAuthGuard)
    @Post('logout')
    async logout(@Session() session:any) {
        session.userId = null
        return {
            message:'User logout successfully'
        }
    }
    ///////////////////////// Unauthenticated Routes /////////////////////////
    @Serialize(UserResponseDto)
    @UseGuards(NotUserAuthGuard)
    @Post('loginRegister')
    async createOrLogin(@Body() body:CreateLoginDto) {
        // Logic to create a new user
        return this._authService.createLoginUser(body)
    }
    @Serialize(UserResponseDto)
    @UseGuards(NotUserAuthGuard)
    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto,  @Session() session:any) {
        const res = await this._authService.verifyAdmin(email, otp)
        session.userId = res.user.id
        return res
    }
}
