import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDto from './dto/request/create-event.dto';
import UpdateEventDto from './dto/request/update-event-dto';
import { User } from '@/modules/users/user.entity';
import { EventDto } from './dto/response/event.dto';
import Serialize from '@/decorators/serialize.decorator';
import { ApproveEventDto } from './dto/request/approve-event.dto';
import { EventResponseDto } from './dto/response/event-response.dto';
import SearchEventDto from './dto/request/search-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { PaginatedEventsDto } from './dto/response/paginated-events.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/events')
export class EventsAdminController {
  constructor(private readonly eventsService: EventsService) {}
  ////////////////// get apis for admin //////////////////
  @Serialize(PaginatedEventsDto)
  @Permissions('view_events')
  @Get()
  @ApiOperation({ summary: 'Get Events' })
  async getEvents(@Query() query: SearchEventDto) {
    const events = await this.eventsService.getEvents(query);
    return events;
  }
  @Serialize(EventDto)
  @Permissions('view_events')
  @Get(':id')
  @ApiOperation({ summary: 'Get Event by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async getEventById(@Param('id') id: number) {
    const event = await this.eventsService.getEventById(id);
    return event;
  }

  @Serialize(EventResponseDto)
  @Permissions('create_events')
  @Post()
  @ApiOperation({ summary: 'Create new Event' })
  async createEvent(
    @Body() eventData: CreateEventDto,
    @CurrentUser() admin: User,
  ) {
    const event = await this.eventsService.createEvent(eventData, admin);
    return event;
  }
  @Serialize(EventResponseDto)
  @Permissions('update_events')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Event' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async updateEvent(
    @Param('id') id: number,
    @Body() eventData: UpdateEventDto,
  ) {
    const event = await this.eventsService.updateEvent(id, eventData);
    return event;
  }

  @Serialize(EventResponseDto)
  @Permissions('delete_events')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Event' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async deleteEvent(@Param('id') id: number) {
    const event = await this.eventsService.deleteEvent(id);
    return event;
  }

  @Serialize(EventResponseDto)
  @Permissions('approve_events')
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve Event' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async approveEvent(
    @Param('id') id: number,
    @Body() { approved }: ApproveEventDto,
  ) {
    const event = await this.eventsService.approveEvent(id, approved);
    return event;
  }
}
