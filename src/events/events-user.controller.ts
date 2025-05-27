import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import Serialize from 'src/decorators/serialize.decorator';

import { EventDto } from './dto/event.dto';

@Serialize(EventDto)
@Controller('events')
export class EventsUserController {
    constructor(private readonly eventsService: EventsService) {}
    /////////////////// public apis for get events and event by id apis /////////////////
    @Get()
    async getEvents() {
        const events = await this.eventsService.getEvents();
        return events;
    }

    @Get(':id')
    async getEventById(@Param('id') id: number) {
        const event = await this.eventsService.getEventById(id);
        return event;
    }
}