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
  Patch,
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
import { CreateUpdateUserDto } from './dto/request/create-update-user.dto';
import { CreateUpdateAdminDto } from './dto/request/create-update-admin.dto';
import { RejectAdminDto } from './dto/request/reject-admin.dto';
import { AssignRolesToAdminDto } from './dto/request/assign-roles.dto';
import { RolesService } from '../roles/roles.service';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/users')
export class UserAdminController {
  constructor(private _userService: UserService, private _rolesService:RolesService) {}

  ///////////////////////// Authenticated Routes /////////////////////////
  @Serialize(UserDto)
  @Get('me')
  @ApiOperation({
    summary: 'Get Current Admin',
    description: 'This Api get the logged in admin',
  })
  getCurrentAdmin(@CurrentUser() admin: User) {
    return admin;
  }

  @Serialize(UserResponseDto)
  @Permissions('create_users')
  @Post('users')
  @ApiOperation({ summary: 'Create User' })
  createUser(@Body() body: CreateUpdateUserDto) {
    return this._userService.createUserByAdmin(body);
  }

  @Serialize(UserResponseDto)
  @Permissions('update_users')
  @Patch('users/:id')
  @ApiOperation({ summary: 'Update User' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  updateUser(@Body() body: CreateUpdateUserDto, @Param('id') id: number) {
    return this._userService.updateUserByAdmin(id, body);
  }

  @Serialize(UserResponseDto)
  @Permissions('create_admins')
  @Post('admins')
  @ApiOperation({ summary: 'Create Admin' })
  createAdmin(@Body() body: CreateUpdateAdminDto) {
    return this._userService.createAdminByAdmin(body);
  }

  @Serialize(UserResponseDto)
  @Permissions('update_admins')
  @Patch('admins/:id')
  @ApiOperation({ summary: 'Update Admin' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  updateAdmin(@Body() body: CreateUpdateAdminDto, @Param('id') id: number) {
    return this._userService.updateAdminByAdmin(id, body);
  }

  @Serialize(PaginatedUsersDto)
  @Permissions('view_users')
  @Get('users')
  @ApiOperation({ summary: 'Get Users' })
  findUsers(@Query() query: SearchUserDto) {
    // Logic to fetch all users
    return this._userService.getUsers(query, UserType.USER);
  }

  @Serialize(PaginatedUsersDto)
  @Permissions('view_admins')
  @Get('admins')
  @ApiOperation({ summary: 'Get Admins' })
  findAdmins(@Query() query: SearchUserDto) {
    // Logic to fetch all users
    return this._userService.getUsers(query, UserType.ADMIN);
  }

  @Serialize(UserDto)
  @Permissions('view_users')
  @Get('users/:id')
  @ApiOperation({ summary: 'Get User by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  findUser(@Param('id') id: number) {
    // Logic to fetch a user by ID
    return this._userService.findUserById(id);
  }

  @Serialize(UserDto)
  @Permissions('view_admins')
  @Get('admins/:id')
  @ApiOperation({ summary: 'Get Admin by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  findAdmin(@Param('id') id: number) {
    // Logic to fetch a user by ID
    return this._userService.findAdminById(id);
  }

  @Serialize(UserResponseDto)
  @Permissions('delete_users')
  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
  removeUser(@Param('id') id: number) {
    return this._userService.removeUser(id, UserType.USER);
  }

  @Serialize(UserResponseDto)
  @Permissions('delete_admins')
  @Delete('admins/:id')
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  removeAdmin(@Param('id') id: number) {
    return this._userService.removeUser(id, UserType.ADMIN);
  }

  @Serialize(UserResponseDto)
  @Permissions('approve_admins')
  @Post('admins/:id/approve')
  @ApiOperation({ summary: 'Approve Admin' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  approveAdmin(@Param('id') id: number) {
    return this._userService.approveAdmin(id);
  }
  @Serialize(UserResponseDto)
  @Permissions('reject_admins')
  @Post('admins/:id/reject')
  @ApiOperation({ summary: 'Reject Admin' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  rejectAdmin(@Param('id') id: number, @Body() body: RejectAdminDto) {
    return this._userService.rejectAdmin(id, body.reason);
  }

  @Serialize(UserResponseDto)
  @Permissions('assign_roles_to_admin')
  @Patch('admins/:id/assign-roles')
  @ApiOperation({ summary: 'Assign Roles To Admin' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Admin ID' })
  assignRolesToAdmin(@Param('id') id: number, @Body() assignRolesToAdminData: AssignRolesToAdminDto) {
    return this._rolesService.assignRolesToAdmin(assignRolesToAdminData, id);
  }
}
