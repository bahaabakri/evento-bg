import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/verfiy-user.dto';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './gurads/admin-auth.guard';
import NotAdminAuthGuard from './gurads/not-admin-auth.guard';

@Controller('admin/auth')
export class AuthAdminController {
    constructor(private _authService:AuthService) {}
    /////////////////////////// Authenticated Routes /////////////////////////

    @UseGuards(AdminAuthGuard)
    @Post('logout')
    async logoutAdmin(@Session() session:any) {
        session.adminId = null
        return {
            message:'Admin logout successfully'
        }
    }
    ///////////////////////// Unauthenticated Routes /////////////////////////

    @UseGuards(NotAdminAuthGuard)
    @Post('loginRegister')
    async createOrLoginAdmin(@Body() body:CreateLoginDto) {
        // Logic to create a new admin
        return this._authService.createLoginAdmin(body)
    }

     @UseGuards(NotAdminAuthGuard)
    @Post('verify')
    async verifyAdmin(@Body() {email, otp}: VerifyUserDto,  @Session() session:any) {
        const res = await this._authService.verifyAdmin(email, otp)
        session.adminId = res.user.id
        return res
    }
}
