import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import Serialize from 'src/decorators/serialize.decorator';
import { UserDto } from './dto/response/user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import SearchUserDto from './dto/request/search-user.dto';
import { PaginatedUsersDto } from './dto/response/paginated-users.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/users')
export class UserAdminController {
  constructor(private _userService: UserService) {}

  ///////////////////////// Authenticated Routes /////////////////////////
  @Serialize(UserDto)
  @Get('me')
  @ApiOperation({ summary: 'Get Current Admin', description: 'This Api get the logged in admin'})
  getCurrentAdmin(@CurrentUser() admin: User) {
    return admin;
  }

  @Serialize(PaginatedUsersDto)
  @Permissions('view_admins', 'view_users')
  @Get()
  @ApiOperation({ summary: 'Get Users'})
  findAll(@Query() query:SearchUserDto ) {
    // Logic to fetch all users
    return this._userService.findUsers(query);
  }

  @Serialize(UserDto)
  @Permissions('view_admins', 'view_users')
  @Get(':id')
  @ApiOperation({ summary: 'Get User by id'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  findOne(@Param('id') id: string) {
    // Logic to fetch a user by ID
    return this._userService.findUserById(parseInt(id));
  }

  @Serialize(UserResponseDto)
  @Permissions('delete_users', 'delete_admins')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  removeUser(@Param('id') id: string) {
    return this._userService.removeUser(parseInt(id));
  }

  @Serialize(UserResponseDto)
  @Permissions('approve_admins')
  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve Admin'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  approveAdmin(@Param('id') id: string) {
    return this._userService.approveAdmin(parseInt(id));
  }

  // TO DO: create and update user/admin endpoints
}
