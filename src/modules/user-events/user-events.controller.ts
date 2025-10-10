import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import Serialize from 'src/decorators/serialize.decorator';
import { UserEventsService } from '../user-events/user-events.service';
import { UserEventsResponseDto } from '../user-events/dto/response/user-events-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
@UseGuards(AuthGuard('jwt'))
@Controller('user-events')
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}
  /////////////////// public apis for get events and event by id apis /////////////////
  // @Serialize(PaginatedEventsDto)
  // @Get()
  // async getEvents(@Query() query:SearchEventDto) {
  //     const events = await this.eventsService.getEvents(query);
  //     return events;
  // }

  @Serialize(UserEventsResponseDto)
  @Post(':id/join')
  @ApiOperation({ summary: 'Join event' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Event ID' })
  async joinEvent(@Param('id') id: number, @CurrentUser() user: User) {
    return await this.userEventsService.joinEvent(user, id);
  }
}
