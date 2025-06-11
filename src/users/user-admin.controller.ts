import { Controller, Get, Post, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('admin/users')
export class UserAdminController {
    constructor(private _userService:UserService) {}

    ///////////////////////// Authenticated Routes /////////////////////////
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('me')
    getCurrentAdmin(@CurrentUser() admin) {
        return {
            admin
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    findAll() {
        // Logic to fetch all users
        return this._userService.findAllUsers()
    }
 
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id') id: string) {
        // Logic to fetch a user by ID
        return this._userService.findUserById(parseInt(id))
    }

    @UseGuards(RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Delete(':id')
    removeUser(@Param('id') id: string) {
      return this._userService.removeUser(parseInt(id));
    }

}