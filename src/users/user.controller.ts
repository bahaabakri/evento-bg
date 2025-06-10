import { Controller, Get, Post, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private _userService:UserService) {}
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getCurrentUser(@Req() req: any) {
        return {
            user: req.user
        }
    }
}