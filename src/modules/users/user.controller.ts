import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from './user.entity';
import Serialize from 'src/decorators/serialize.decorator';
import { UserDto } from './dto/response/user.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    @Serialize(UserDto)
    @Get('me')
    getCurrentUser(@CurrentUser() user:User) {
        return user  
    }
}