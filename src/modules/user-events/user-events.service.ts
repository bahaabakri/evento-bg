import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../events/event.entity';
import { User } from '../users/user.entity';
import { UserEvent } from './user-events.entity';

@Injectable()
export class UserEventsService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepo: Repository<UserEvent>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async joinEvent(
    user: User,
    eventId: number,
  ): Promise<{ message: string; userEvent: UserEvent }> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.userEventRepo.findOne({
      where: { user: { id: user.id }, event: { id: eventId } },
    });
    if (existing) throw new BadRequestException('Already joined this event');

    const userEvent = this.userEventRepo.create({ user, event });
    await this.userEventRepo.save(userEvent);
    const createdUserEvents = await this.userEventRepo.findOne({
      where: { id: userEvent.id },
      relations: {
        user: true,
        event: {
          createdBy: true, // also load event creator if needed
        },
      },
    });
    if (!createdUserEvents) throw new NotFoundException('Event not found')
    return {
      message: 'Event joined successfully',
      userEvent: createdUserEvents, // matches DTO key
    };
  }

  /**
   * get all events joint by user
   */
  async getUserJointEvents(user: User) {
    return this.userEventRepo.find({
      where: { user: { id: user.id } },
      relations: ['event'],
    });
  }
}
