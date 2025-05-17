import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/create-login.dto';
import { VerifyUserDto } from 'src/auth/dto/verfiy-user.dto';
import { UserAuthGuard } from 'src/auth/gurads/user-auth.guard';
import NotAuthGuard from 'src/auth/gurads/not-user-auth.guard';
import { AuthService } from './auth.service';
import { RolesGuard } from './gurads/roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import NotUserAuthGuard from 'src/auth/gurads/not-user-auth.guard';
import { AdminAuthGuard } from './gurads/admin-auth.guard';
import NotAdminAuthGuard from './gurads/not-admin-auth.guard';

@Controller('auth')
export class AuthController {
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

    @UseGuards(AdminAuthGuard)
    @Post('admin/logout')
    async logoutAdmin(@Session() session:any) {
        session.adminId = null
        return {
            message:'Admin logout successfully'
        }
    }
    ///////////////////////// Unauthenticated Routes /////////////////////////
    @UseGuards(NotUserAuthGuard)
    @Post('loginRegister')
    async createOrLogin(@Body() body:CreateLoginDto) {
        // Logic to create a new user
        return this._authService.createLoginUser(body)
    }

    @UseGuards(NotAdminAuthGuard)
    @Post('admin/loginRegister')
    async createOrLoginAdmin(@Body() body:CreateLoginDto) {
        // Logic to create a new admin
        return this._authService.createLoginAdmin(body)
    }

    @UseGuards(NotUserAuthGuard)
    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto,  @Session() session:any) {
        const res = await this._authService.verifyUserAdmin(email, otp)
        session.userId = res.user.id
        return res
    }

     @UseGuards(NotAdminAuthGuard)
    @Post('admin/verify')
    async verifyAdmin(@Body() {email, otp}: VerifyUserDto,  @Session() session:any) {
        const res = await this._authService.verifyUserAdmin(email, otp)
        session.adminId = res.user.id
        return res
    }
}
