import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../auth/gurads/auth.guard';
import { AdminGuard } from 'src/auth/gurads/admin.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private _userService:UserService) {}

    ///////////////////////// Authenticated Routes /////////////////////////
    @UseGuards(AdminGuard)
    @Get()
    findAll() {
        // Logic to fetch all users
        return this._userService.findAllUsers()
    }

    @UseGuards(AdminGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        // Logic to fetch a user by ID
        return this._userService.findUserById(parseInt(id))
    }
    
    @UseGuards(AdminGuard)
    @Delete(':id')
    removeUser(@Param('id') id: string) {
      return this._userService.removeUser(parseInt(id));
    }

    @Post('me')
    getCurrentUser(@CurrentUser() user:User) {
        return user
    }
}