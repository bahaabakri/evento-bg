import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { TicketsResponseDto } from './dto/response/tickets-response.dto';
import { AuthGuard } from '@nestjs/passport';
import Serialize from '@/decorators/serialize.decorator';
import SearchTicketDto from './dto/request/search-ticket.dto';
import { PaginatedTicketsDto } from './dto/response/paginated-tickets.dto';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { TicketDto } from './dto/response/tickets.dto';
@ApiTags('Tickets')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Permissions('view_tickets')
@Controller('admin/tickets')
export class TicketsAdminController {
  constructor(private readonly ticketService: TicketsService) {}

  /** Get all tickets */
  @Serialize(PaginatedTicketsDto)
  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async getTickets(@Query() query: SearchTicketDto) {
    return this.ticketService.getTickets(query);
  }

  /** Get ticket by ticket id */
  @Serialize(TicketDto)
  @Get(':id')
  @ApiOperation({ summary: 'Get Ticket by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Ticket ID' })
  async getEventById(@Param('id') id: number) {
    return this.ticketService.getTicketById(id);
  }
  /** Get tickets for a specific user */
  @Serialize(PaginatedTicketsDto)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets for a specific user' })
  @ApiParam({ name: 'userId', type: Number })
  async getUserTickets(
    @Param('userId') userId: number,
    @Query() query: SearchTicketDto,
  ) {
    return this.ticketService.getTickets({ ...query, userId });
  }

  /** Get tickets for a specific event */
  @Serialize(PaginatedTicketsDto)
  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get tickets for a specific event' })
  @ApiParam({ name: 'eventId', type: Number })
  async getEventTickets(
    @Param('eventId') eventId: number,
    @Query() query: SearchTicketDto,
  ) {
    return this.ticketService.getTickets({ ...query, eventId });
  }
}
