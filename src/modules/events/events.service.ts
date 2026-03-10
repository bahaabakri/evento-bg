import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { UploadImageService } from '@/modules/upload-image/upload-image.service';
import { User } from '@/modules/users/user.entity';
import SearchEventDto from './dto/request/search-event.dto';
import { ImageObject, PaginatedResult } from '@/types/types';
import { validateId } from '@/util';
import CreateUpdateEvent from './dto/request/create-update-event.dto';
import CreateUpdateEventDto from './dto/request/create-update-event.dto';
import { FavoriteEventEntity } from './entities/favorite-event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity) private _eventRepo: Repository<EventEntity>,
    @InjectRepository(User) private _userRepo: Repository<User>,
    @InjectRepository(FavoriteEventEntity)
    private _favoriteEventRepo: Repository<FavoriteEventEntity>,
    private _uploadImageService: UploadImageService,
  ) {}

  /**
   * Create a new event
   * @param eventData
   * @returns
   */
  async createEvent(
    eventData: CreateUpdateEventDto,
    admin: User,
  ): Promise<{ message: string; event: EventEntity }> {
    // Here you would typically save the event to a database
    // For this example, we'll just return the event data
    const images: ImageObject[] = [];
    for (const id of eventData.imagesIds) {
      const image = await this._uploadImageService.getImageById(+id);
      images.push({
        id: image.id,
        name: image.name,
        url: image.imagePath,
      });
    }
    const event = this._eventRepo.create({
      ...eventData,
      isActive: true,
      createdBy: admin,
      images,
    });
    const createdSavedEvent = await this._eventRepo.save(event);
    return {
      message: 'Event created successfully',
      event: createdSavedEvent,
    };
  }

  /**
   * Get  events
   * @returns
   */
  async getEvents(
    { query, page = 1, perPage = 10, favorite = false }: SearchEventDto,
    userId: number | null = null,
  ): Promise<PaginatedResult<EventEntity>> {
    // Here you would typically fetch events from a database

    const skip = (page - 1) * perPage;
    const qb = this._eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'user')
      .leftJoinAndSelect('event.plans', 'plans')
      .orderBy('event.date', 'ASC');

    if (query?.trim()) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('LOWER(event.name) LIKE LOWER(:query)', {
              query: `%${query}%`,
            })
            .orWhere('LOWER(event.description) LIKE LOWER(:query)', {
              query: `%${query}%`,
            })
            .orWhere('LOWER(event.location) LIKE LOWER(:query)', {
              query: `%${query}%`,
            });
        }),
      );
    }

    if (userId) {
      qb.leftJoin(
        'event.favoritedBy',
        'favorite',
        'favorite.user.id = :userId',
        { userId },
      );
      qb.addSelect('favorite.id', 'favorite_id');
    }

    if (favorite && userId) {
      qb.andWhere('favorite.id IS NOT NULL');
    }

    const total = await qb.clone().getCount();

    const { entities, raw } = await qb
      .skip(skip)
      .take(perPage)
      .getRawAndEntities();

    const events = entities.map((event, index) => ({
      ...event,
      isFavorite: !!raw[index]?.favorite_id,
    }));

    return this.getEventsResponse(events, page, perPage, total);
  }

  private getEventsResponse(
    events: EventEntity[],
    page: number,
    perPage: number,
    total: number,
  ): PaginatedResult<EventEntity> {
    return {
      data: events,
      meta: {
        total,
        page,
        perPage,
      },
    };
  }

  /**
   * Get an event by ID
   * @param id
   */

  async getEventById(id: number): Promise<EventEntity> {
    // Here you would typically fetch an event from a database
    const event = await this._eventRepo.findOne({
      where: { id: validateId(id) },
      relations: {
        createdBy: true,
        tickets: {
          user: true,
        },
        plans: true,
      },
    });
    if (!event) {
      throw new NotFoundException('Event Not Found');
    }
    return event;
  }

  /**
   * Get Fav by userid and event id
   * @param eventId
   * @param userId
   */
  async getFavoriteByUserAndEvent(
    eventId: number,
    userId: number,
  ): Promise<FavoriteEventEntity | null> {
    const favorite = await this._favoriteEventRepo.findOne({
      where: {
        event: { id: validateId(eventId) },
        user: { id: validateId(userId) },
      },
    });
    return favorite;
  }

  /**
   * Update an event by ID
   * @param id
   * @param eventData
   * @returns
   */
  async updateEvent(
    id: number,
    eventData: CreateUpdateEvent,
  ): Promise<{ message: string; event: EventEntity }> {
    // Here you would typically update an event in a database
    // For this example, we'll just return the updated event data
    const savedEvent = await this.getEventById(id);
    let updatedEvent = { ...savedEvent, ...eventData };
    if (eventData.imagesIds) {
      const images: ImageObject[] = [];
      for (const id of eventData.imagesIds) {
        const image = await this._uploadImageService.getImageById(id);
        images.push({
          id: image.id,
          name: image.name,
          url: image.imagePath,
        });
      }
      updatedEvent = { ...updatedEvent, images };
    }
    const updatedSavedEvent = await this._eventRepo.save(updatedEvent);
    return {
      message: 'Event updated successfully',
      event: updatedSavedEvent,
    };
  }
  /**
   * Remove an event by ID
   * @param id
   */
  async deleteEvent(
    id: number,
  ): Promise<{ message: string; event: EventEntity }> {
    // Here you would typically remove an event from a database
    // For this example, we'll just return the updated event data
    const event = await this.getEventById(id);
    const deletedEvent = await this._eventRepo.remove(event);
    return {
      message: 'Event deleted successfully',
      event: deletedEvent,
    };
  }

  /**
   * Approve an event by ID
   * @param id
   */
  async approveEvent(
    id: number,
    approved: boolean,
  ): Promise<{ message: string; event: EventEntity }> {
    const event = await this.getEventById(id);
    event.isApproved = approved;
    const updatedSavedEvent = await this._eventRepo.save(event);
    return {
      message: `Event ${approved ? 'approved' : 'disapproved'} successfully`,
      event: updatedSavedEvent,
    };
  }

  /**
   * Add to favorite
   */
  async addEventToFavorites(
    eventId: number,
    user: User,
  ): Promise<{ message: string; isFavorite: boolean }> {
    // get user
    const myuser = await this._userRepo.findOne({ where: { id: user.id } });
    if (!myuser) {
      throw new NotFoundException('User not found');
    }

    // get event
    const event = await this._eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // add to favorites
    const isExists = await this.getFavoriteByUserAndEvent(eventId, myuser.id);
    if (isExists) {
      throw new BadRequestException('Event is already in favorites');
    }
    const createdFav = this._favoriteEventRepo.create({
      user: myuser,
      event,
    });
    await this._favoriteEventRepo.save(createdFav);
    return {
      message: 'Event added to favorites successfully',
      isFavorite: true,
    };
  }

  /**
   * Remove from favorites
   */
  async removeEventFromFavorites(
    eventId: number,
    user: User,
  ): Promise<{ message: string; isFavorite: boolean }> {
    // get user
    const myuser = await this._userRepo.findOne({ where: { id: user.id } });
    if (!myuser) {
      throw new NotFoundException('User not found');
    }

    // get event
    const event = await this._eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // remove from favorites
    const favEntity = await this.getFavoriteByUserAndEvent(eventId, myuser.id);
    if (!favEntity) {
      throw new BadRequestException('Event is not in favorites');
    }
    await this._favoriteEventRepo.remove(favEntity);
    return {
      message: 'Event removed from favorites successfully',
      isFavorite: false,
    };
  }
}
