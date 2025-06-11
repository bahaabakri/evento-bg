import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDto from './dto/request/create-event.dto';
import UpdateEventDto from './dto/request/update-event-dto';
import { User } from 'src/users/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { EventDto } from './dto/response/event.dto';
import Serialize from 'src/decorators/serialize.decorator';
import { ApproveEventDto } from './dto/request/approve-event.dto';
import { EventResponseDto } from './dto/response/event-response.dto';
import SearchEventDto from './dto/request/search-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/events')
export class EventsAdminController {
    constructor(private readonly eventsService: EventsService) {}
    ////////////////// get apis for admin //////////////////
    @Serialize(EventDto)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async getEvents(@Query() query:SearchEventDto) {
        const events = await this.eventsService.getEvents(query);
        return events;
    }
    @Serialize(EventDto)
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async getEventById(@Param('id') id: number) {
        const event = await this.eventsService.getEventById(id);
        return event;
    }

    ///////////////////// post apis for moderator ///////////
    @Serialize(EventResponseDto)
    @UseGuards(RolesGuard)
    @Roles(Role.MODERATOR)
    @Post()
    async createEvent(@Body() eventData: CreateEventDto, @CurrentUser() admin:User) {
        const event = await this.eventsService.createEvent(eventData, admin);
        return event;
    }
    @Serialize(EventResponseDto)
    @UseGuards(RolesGuard)
    @Roles(Role.MODERATOR)
    @Patch(':id')
    async updateEvent(@Param('id') id: number, @Body() eventData: UpdateEventDto) {
        const event = await this.eventsService.updateEvent(id, eventData);
        return event;
    }

     ///////////////////// post apis for super admin ///////////
     @Serialize(EventResponseDto)
    @UseGuards(RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Delete(':id')
    async deleteEvent(@Param('id') id: number) {
        const event = await this.eventsService.deleteEvent(id);
        return event;
    }

    @Serialize(EventResponseDto)
    @UseGuards(RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/approve')
    async approveEvent(@Param('id') id: number, @Body() {approved}:ApproveEventDto) {
        const event = await this.eventsService.approveEvent(id, approved);
        return event;
    }
}
