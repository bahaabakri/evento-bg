import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { EventTicket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsUserController } from './tickets-user.controller';
import { TicketsAdminController } from './tickets-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventTicket, EventEntity])],
  controllers: [TicketsUserController, TicketsAdminController],
  providers: [TicketsService]
})
export class TicketsModule {}
