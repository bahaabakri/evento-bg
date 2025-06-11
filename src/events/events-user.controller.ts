import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import Serialize from 'src/decorators/serialize.decorator';
import { EventResponseDto } from './dto/response/event-response.dto';
import SearchEventDto from './dto/request/search-event.dto';

@Serialize(EventResponseDto)
@Controller('events')
export class EventsUserController {
    constructor(private readonly eventsService: EventsService) {}
    /////////////////// public apis for get events and event by id apis /////////////////
    @Get()
    async getEvents(@Query() query:SearchEventDto) {
        const events = await this.eventsService.getEvents(query);
        return events;
    }

    @Get(':id')
    async getEventById(@Param('id') id: number) {
        const event = await this.eventsService.getEventById(id);
        return event;
    }
}