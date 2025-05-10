import { Controller, Get, Post, Body, Param, Session, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { VerifyUserDto } from './dto/verfiy-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private _userService:UserService) {}
    @Get()
    findAll() {
        // Logic to fetch all users
        return 'This action returns all users';
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Logic to fetch a user by ID
        return `This action returns user with id: ${id}`;
    }

    @Post('loginRegister')
    async createOrLogin(@Body() {email}:CreateLoginDto, @Session() session:any) {
        // Logic to create a new user
        const res = await this._userService.createOrLoginUser(email)
        session.userId = res.user.id
        return res
    }

    @Post('verify')
    async verifyUser(@Body() {email, otp}: VerifyUserDto) {
        return this._userService.verifyUser(email, otp)
    }

    @Delete(':id')
    removeUser(@Param('id') id: string) {
      return this._userService.removeUser(parseInt(id));
    }


    @Post('me')
    getCurrentUser(@CurrentUser() user:User) {
        return user
    }
    @Post('logout')
    async logout(@Session() session:any) {
        session.userId = null
        return {
            message:'User logout successfully'
        }
    }
}