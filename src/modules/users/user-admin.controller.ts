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
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import Serialize from 'src/decorators/serialize.decorator';
import { UserDto } from './dto/response/user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import SearchUserDto from './dto/request/search-user.dto';
import { PaginatedUsersDto } from './dto/response/paginated-users.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('admin/users')
export class UserAdminController {
  constructor(private _userService: UserService) {}

  ///////////////////////// Authenticated Routes /////////////////////////
  @Serialize(UserDto)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  getCurrentAdmin(@CurrentUser() admin: User) {
    return admin;
  }

  // * To do
  //  apply pagination serialize dto and pagination logic inside

  @Serialize(PaginatedUsersDto)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query:SearchUserDto ) {
    // Logic to fetch all users
    return this._userService.findUsers(query);
  }

  @Serialize(UserDto)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Logic to fetch a user by ID
    return this._userService.findUserById(parseInt(id));
  }

  @Serialize(UserResponseDto)
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this._userService.removeUser(parseInt(id));
  }

  @Serialize(UserResponseDto)
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post(':id/approve')
  approveAdmin(@Param('id') id: string) {
    return this._userService.approveAdmin(parseInt(id));
  }
}
