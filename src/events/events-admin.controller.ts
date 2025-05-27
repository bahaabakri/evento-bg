import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event-dto';
import { UserAuthGuard } from 'src/auth/gurads/user-auth.guard';
import { CurrentAdmin } from 'src/auth/decorators/current-admin.decorator';
import { User } from 'src/users/user.entity';
import { AdminAuthGuard } from 'src/auth/gurads/admin-auth.guard';
import { RolesGuard } from 'src/auth/gurads/roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { EventDto } from './dto/event.dto';
import Serialize from 'src/decorators/serialize.decorator';

@Serialize(EventDto)
@UseGuards(AdminAuthGuard)
@Controller('admin/events')
export class EventsAdminController {
    constructor(private readonly eventsService: EventsService) {}
    ////////////////// get apis for admin //////////////////
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async getEvents() {
        const events = await this.eventsService.getEvents();
        return events;
    }
    
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async getEventById(@Param('id') id: number) {
        const event = await this.eventsService.getEventById(id);
        return event;
    }

    ///////////////////// post apis for moderator ///////////
    @UseGuards(RolesGuard)
    @Roles(Role.MODERATOR)
    @Post()
    async createEvent(@Body() eventData: CreateEventDto, @CurrentAdmin() admin:User) {
        const event = await this.eventsService.createEvent(eventData, admin);
        return event;
    }
    @UseGuards(RolesGuard)
    @Roles(Role.MODERATOR)
    @Patch(':id')
    async updateEvent(@Param('id') id: number, @Body() eventData: UpdateEventDto) {
        const event = await this.eventsService.updateEvent(id, eventData);
        return event;
    }

    @UseGuards(RolesGuard)
    @Roles(Role.MODERATOR)
    @Delete(':id')
    async deleteEvent(@Param('id') id: number) {
        const event = await this.eventsService.deleteEvent(id);
        return event;
    }
}
