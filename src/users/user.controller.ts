import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    @Get('me')
    getCurrentUser(@CurrentUser() user) {
        return {
            user
        }
    }
}