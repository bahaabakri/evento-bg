import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/verfiy-user.dto';
import { AuthGuard } from 'src/auth/gurads/auth.guard';
import NotAuthGuard from 'src/auth/gurads/not-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private _authService:AuthService) {}
    /////////////////////////// Authenticated Routes /////////////////////////
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Session() session:any) {
        session.userId = null
        return {
            message:'User logout successfully'
        }
    }

    ///////////////////////// Unauthenticated Routes /////////////////////////
    @UseGuards(NotAuthGuard)
    @Post('loginRegister')
    async createOrLogin(@Body() {email}:CreateLoginDto) {
        // Logic to create a new user
        return this._authService.createOrLoginUser(email)
    }

    @UseGuards(NotAuthGuard)
    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto,  @Session() session:any) {
        const res = await this._authService.verifyUser(email, otp)
        session.userId = res.user.id
        return res
    }
}
