import { Controller, Get, Param, Post, Query, UseGuards, Body } from '@nestjs/common';
import Serialize from '@/decorators/serialize.decorator';
import { TicketsService } from './tickets.service';
import { TicketsResponseDto } from './dto/response/tickets-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { JoinEventDto } from './dto/request/join-event.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('ticket')
export class TicketsUserController {
  constructor(private readonly ticketService: TicketsService) {}
  /////////////////// public apis for request join event /////////////////

  @Serialize(TicketsResponseDto)
  @Post('join')
  @ApiOperation({ summary: 'Join event / purchase tickets' })
  async joinEvent(
    @Body() body: JoinEventDto,
    @CurrentUser() user: User,
  ) {
    return await this.ticketService.joinEvent(user, body);
  }
}
