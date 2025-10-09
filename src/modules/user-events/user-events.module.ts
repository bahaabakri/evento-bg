import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from './user-events.entity';
import { EventEntity } from '../events/event.entity';
import { UserEventsService } from './user-events.service';
import { UserEventsController } from './user-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEvent, EventEntity])],
  controllers: [UserEventsController],
  providers: [UserEventsService]
})
export class UserEventsModule {}
