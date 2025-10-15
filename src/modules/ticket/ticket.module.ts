import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { EventTicket } from './ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventTicket, EventEntity])],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}
