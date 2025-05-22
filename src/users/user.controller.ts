import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from '../auth/gurads/roles.guard';
import { AdminAuthGuard } from '../auth/gurads/admin-auth.guard';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';

@Controller('users')
export class UserController {
    constructor(private _userService:UserService) {}

    ///////////////////////// Authenticated Routes /////////////////////////
    @UseGuards(AdminAuthGuard,RolesGuard)
    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        // Logic to fetch all users
        return this._userService.findAllUsers()
    }

    @UseGuards(AdminAuthGuard,RolesGuard)
    @Get(':id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        // Logic to fetch a user by ID
        return this._userService.findUserById(parseInt(id))
    }

    @UseGuards(AdminAuthGuard,RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    removeUser(@Param('id') id: string) {
      return this._userService.removeUser(parseInt(id));
    }

    @Post('me')
    getCurrentUser(@CurrentUser() user:User) {
        return user
    }

    @Post('admin/me')
    getCurrentAdmin(@CurrentAdmin() admin:User) {
        return admin
    }
}