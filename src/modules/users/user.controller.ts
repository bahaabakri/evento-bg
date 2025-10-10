import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from './user.entity';
import Serialize from 'src/decorators/serialize.decorator';
import { UserDto } from './dto/response/user.dto';
import { ApiOperation } from '@nestjs/swagger';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  @Serialize(UserDto)
  @Get('me')
  @ApiOperation({
    summary: 'Get Current User',
    description: 'This Api get the logged in user',
  })
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
