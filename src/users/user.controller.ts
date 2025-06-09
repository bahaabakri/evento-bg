import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private _userService:UserService) {}

    @Get('me')
    getCurrentUser(@CurrentUser() user:User) {
        return {
            user
        }
    }
}