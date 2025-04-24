import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event-dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(EventEntity) private _eventRepo:Repository<EventEntity>,
        private _uploadImageService:UploadImageService

) {}
    
    /**
     * Create a new event
     * @param eventData 
     * @returns 
     */
    async createEvent(eventData: CreateEventDto): Promise<EventEntity> {
        // Here you would typically save the event to a database
        // For this example, we'll just return the event data
        const imagesUrls:string[] = []
        eventData.imagesIds.forEach(async (id:string) => {
            const image = await this._uploadImageService.getImageById(+id)
            imagesUrls.push(image.imagePath)
        })
        const event = this._eventRepo.create({
            ...eventData,
            imagesUrls,
            isActive:true,
        });
        await this._eventRepo.save(event);
        return event;
    }

    /**
     * Get all events
     * @returns 
     */
    async getEvents(): Promise<EventEntity[]> {
        // Here you would typically fetch events from a database
        // For this example, we'll just return an empty array
        const events = await this._eventRepo.find();
        return events;
    }

    /**
     * Get an event by ID
     * @param id
     */

    async getEventById(id:number):Promise<EventEntity> {
        // Here you would typically fetch an event from a database
        // For this example, we'll just return an empty array
        if(!id) {
            throw new NotFoundException('Event Not Found')
        }
        const event = await this._eventRepo.findOneBy({ id });
        if (!event) {
            throw new NotFoundException('Event Not Found');
        }
        return event;
    }


    /**
     * Update an event by ID
     * @param id 
     * @param eventData 
     * @returns 
     */
    async updateEvent(id: number, eventData: UpdateEventDto): Promise<{message:string, event:EventEntity}> {
        // Here you would typically update an event in a database
        // For this example, we'll just return the updated event data
        const event = await this.getEventById(id);
        const updateEvent = { ...event, ...eventData };
        await this._eventRepo.save(updateEvent);
        return {
            message: 'Event updated successfully',
            event: updateEvent,
        }
    }
    /**
     * Remove an event by ID
     * @param id
     */
    async deleteEvent(id: number): Promise<{message:string, event:EventEntity}> {
        // Here you would typically remove an event from a database
        // For this example, we'll just return the updated event data
        const event = await this.getEventById(id);
        await this._eventRepo.remove(event);
        return {
            message: 'Event deleted successfully',
            event: event,
        }
    }
}
