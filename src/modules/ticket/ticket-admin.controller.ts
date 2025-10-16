import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { TicketsResponseDto } from './dto/response/tickets-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/roles.enum';
import Serialize from '@/decorators/serialize.decorator';
import SearchTicketDto from './dto/request/search-ticket.dto';
import { PaginatedTicketsDto } from './dto/response/paginated-tickets.dto';
import { TicketsDto } from './dto/response/tickets.dto';

@ApiTags('Tickets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/tickets')
export class TicketAdminController {
  constructor(private readonly ticketService: TicketService) {}

  /** Get all tickets */
  @Get()
  @Serialize(PaginatedTicketsDto)
  @ApiOperation({ summary: 'Get all tickets' })
  async getTickets(@Query() query: SearchTicketDto) {
    return this.ticketService.getTickets(query);
  }

  /** Get ticket by ticket id */
  @Get(':id')
  @Serialize(TicketsDto)
  @ApiOperation({ summary: 'Get Ticket by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Ticket ID' })
  async getEventById(@Param('id') id: number) {
    return this.ticketService.getTicketById(id);
  }
  /** Get tickets for a specific user */
  @Get('user/:userId')
  @Serialize(PaginatedTicketsDto)
  @ApiOperation({ summary: 'Get tickets for a specific user' })
  @ApiParam({ name: 'userId', type: Number })
  async getUserTickets(
    @Param('userId') userId: number,
    @Query() query: SearchTicketDto,
  ) {
    return this.ticketService.getTickets({ ...query, userId });
  }

  /** Get tickets for a specific event */
  @Get('event/:eventId')
  @Serialize(PaginatedTicketsDto)
  @ApiOperation({ summary: 'Get tickets for a specific event' })
  @ApiParam({ name: 'eventId', type: Number })
  async getEventTickets(
    @Param('eventId') eventId: number,
    @Query() query: SearchTicketDto,
  ) {
    return this.ticketService.getTickets({ ...query, eventId });
  }
}
