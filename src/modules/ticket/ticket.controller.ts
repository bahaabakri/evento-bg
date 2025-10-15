import { Controller, Get, Param, Post, Query, UseGuards, Body } from '@nestjs/common';
import Serialize from '@/decorators/serialize.decorator';
import { TicketService } from './ticket.service';
import { TicketsResponseDto } from './dto/response/tickets-response.dto';
import { CreateTicketDto } from './dto/request/create-ticket.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
@UseGuards(AuthGuard('jwt'))
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  /////////////////// public apis for get events and event by id apis /////////////////
  // @Serialize(PaginatedEventsDto)
  // @Get()
  // async getEvents(@Query() query:SearchEventDto) {
  //     const events = await this.eventsService.getEvents(query);
  //     return events;
  // }

  @Serialize(TicketsResponseDto)
  @Post(':id/join')
  @ApiOperation({ summary: 'Join event / purchase tickets' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async joinEvent(
    @Param('id') id: number,
    @Body() body: CreateTicketDto,
    @CurrentUser() user: User,
  ) {
    return await this.ticketService.joinEvent(user, id, body);
  }
}
