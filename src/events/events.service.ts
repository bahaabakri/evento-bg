import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import CreateEventDto from './dto/request/create-event.dto';
import UpdateEventDto from './dto/request/update-event-dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { User } from 'src/users/user.entity';
import SearchEventDto from './dto/request/search-event.dto';

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
    async createEvent(eventData: CreateEventDto, admin:User): Promise<{message:string, event:EventEntity}> {
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
            user: admin   
        });
        const createdSavedEvent = await this._eventRepo.save(event);
        return {
            message: 'Event updated successfully',
            event: createdSavedEvent,
        }
    }

    /**
     * Get  events
     * @returns 
     */
    async getEvents({query}:SearchEventDto): Promise<EventEntity[]> {
        // Here you would typically fetch events from a database
        // For this example, we'll just return an empty array
        // console.log(query);
        if(!query) {
            return this.getAllEvents();
        }
        return this.getSearchEvents(query);
    }


    /**
     * Get all events
     * @returns
     */
    async getAllEvents(): Promise<EventEntity[]> {
        return this._eventRepo.find({
            relations: {
                user: true,
            }
        }); 
    }

    /**
     * get events by search query
     */
    getSearchEvents(query:string): Promise<EventEntity[]> {
        return this._eventRepo.createQueryBuilder('event')
            .leftJoinAndSelect('event.user', 'user')
            .where('LOWER(event.name) LIKE LOWER(:query)', {query: `%${query}%`})
            .orWhere('LOWER(event.description) LIKE LOWER(:query)', {query: `%${query}%`})
            .orWhere('LOWER(event.location) LIKE LOWER(:query)', {query: `%${query}%`})
            .orderBy('event.date', 'DESC')
            .getMany();
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
        const event = await this._eventRepo.findOne({ 
            where: {id},
            relations: {
                user: true,
            }});
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
        const savedEvent = await this.getEventById(id);
        let updatedEvent = { ...savedEvent, ...eventData };
        if (eventData.imagesIds) {
            const imagesUrls:string[] = []
            eventData.imagesIds.forEach(async (id:string) => {
                const image = await this._uploadImageService.getImageById(+id)
                imagesUrls.push(image.imagePath)
            })
            updatedEvent = {...updatedEvent, imagesUrls}
        }
        const updatedSavedEvent = await this._eventRepo.save(updatedEvent);
        return {
            message: 'Event updated successfully',
            event: updatedSavedEvent,
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
        const deletedEvent = await this._eventRepo.remove(event);
        return {
            message: 'Event deleted successfully',
            event: deletedEvent,
        }
    }

    /**
     * Approve an event by ID
     * @param id
     */
    async approveEvent(id: number, approved:boolean): Promise<{message:string, event:EventEntity}> {
        const event = await this.getEventById(id);
        event.isApproved = approved;
        const updatedSavedEvent = await this._eventRepo.save(event);
        return {
            message: `Event ${approved ? 'approved' : 'disapproved'} successfully`,
            event: updatedSavedEvent,
        }
    }
}
