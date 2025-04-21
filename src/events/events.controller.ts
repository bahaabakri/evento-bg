import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event-dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
    @Post()
    async createEvent(@Body() eventData: CreateEventDto) {
        const event = await this.eventsService.createEvent(eventData);
        return event;
    }

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

    @Patch(':id')
    async updateEvent(@Param('id') id: number, @Body() eventData: UpdateEventDto) {
        const event = await this.eventsService.updateEvent(id, eventData);
        return event;
    }

    @Delete(':id')
    async deleteEvent(@Param('id') id: number) {
        const event = await this.eventsService.deleteEvent(id);
        return event;
    }
}
