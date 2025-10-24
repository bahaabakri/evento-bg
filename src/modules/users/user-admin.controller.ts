import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Body,
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
import { UserType } from './user-type.enum';
import { CreateAdminDto } from '../auth/dto/request/create-admin.dto';
import { CreateLoginDto } from '../auth/dto/request/create-login.dto';
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

  @Serialize(UserResponseDto)
  @Permissions('create_users')
  @Post('users')
  @ApiOperation({ summary: 'Create User'})
  createUser(@Body() body: CreateLoginDto) {
    return this._userService.createUserByAdmin(body);
  }

  @Serialize(UserResponseDto)
  // @Permissions('create_admins')
  @Post('admins')
  @ApiOperation({ summary: 'Create Admin'})
  createAdmin(@Body() body: CreateAdminDto) {
    return this._userService.createAdminByAdmin(body);
  }

  @Serialize(PaginatedUsersDto)
  @Permissions('view_users')
  @Get('users')
  @ApiOperation({ summary: 'Get Users'})
  findUsers(@Query() query:SearchUserDto ) {
    // Logic to fetch all users
    return this._userService.findUsers(query, UserType.USER);
  }

  @Serialize(PaginatedUsersDto)
  @Permissions('view_admins')
  @Get('admins')
  @ApiOperation({ summary: 'Get Admins'})
  findAdmins(@Query() query:SearchUserDto ) {
    // Logic to fetch all users
    return this._userService.findUsers(query, UserType.ADMIN);
  }

  @Serialize(UserDto)
  @Permissions('view_users')
  @Get('users/:id')
  @ApiOperation({ summary: 'Get User by id'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  findUser(@Param('id') id: string) {
    // Logic to fetch a user by ID
    return this._userService.findUserById(parseInt(id));
  }

  @Serialize(UserDto)
  @Permissions('view_admins')
  @Get('admins/:id')
  @ApiOperation({ summary: 'Get Admin by id'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  findAdmin(@Param('id') id: string) {
    // Logic to fetch a user by ID
    return this._userService.findAdminById(parseInt(id));
  }

  @Serialize(UserResponseDto)
  @Permissions('delete_users')
  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete User'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  removeUser(@Param('id') id: string) {
    return this._userService.removeUser(parseInt(id), UserType.USER);
  }

  @Serialize(UserResponseDto)
  @Permissions('delete_admins')
  @Delete('admins/:id')
  @ApiOperation({ summary: 'Delete Admin'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  removeAdmin(@Param('id') id: string) {
    return this._userService.removeUser(parseInt(id), UserType.ADMIN);
  }

  @Serialize(UserResponseDto)
  @Permissions('approve_admins')
  @Post('admins/:id/approve')
  @ApiOperation({ summary: 'Approve Admin'})
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  approveAdmin(@Param('id') id: string) {
    return this._userService.approveAdmin(parseInt(id));
  }

}
