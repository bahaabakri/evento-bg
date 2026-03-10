import {
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import Serialize from '@/decorators/serialize.decorator';
import SearchEventDto from './dto/request/search-event.dto';
import { PaginatedEventsDto } from './dto/response/paginated-events.dto';
import { EventDto } from './dto/response/event.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EventResponseDto } from './dto/response/event-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
@Controller('events')
export class EventsUserController {
  constructor(private readonly eventsService: EventsService) {}
  /////////////////// public apis for get events and event by id apis /////////////////

  @UseGuards(OptionalJwtAuthGuard)
  @Serialize(PaginatedEventsDto)
  @Get()
  @ApiOperation({ summary: 'Get Events' })
  async getEvents(
    @Query() query: SearchEventDto,
    @CurrentUser() user: User | null,
  ) {
    const events = await this.eventsService.getEvents(query, user?.id);
    return events;
  }

  @Serialize(EventDto)
  @Get(':id')
  @ApiOperation({ summary: 'Get Event by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async getEventById(@Param('id') id: number) {
    const event = await this.eventsService.getEventById(id);
    return event;
  }

  // add / remove favorite event for authenticated user only
  @UseGuards(AuthGuard('jwt'))
  @Serialize(EventResponseDto)
  @Post(':id/favorite')
  @ApiOperation({ summary: 'Add To Favorite' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async addToFavorite(@Param('id') eventId: number, @CurrentUser() user: User) {
    const event = await this.eventsService.addEventToFavorites(eventId, user);
    return event;
  }

  @UseGuards(AuthGuard('jwt'))
  @Serialize(EventResponseDto)
  @Delete(':id/favorite')
  @ApiOperation({ summary: 'Remove From Favorite' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async removeFromFavorite(
    @Param('id') eventId: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.removeEventFromFavorites(
      eventId,
      user,
    );
    return event;
  }
}
