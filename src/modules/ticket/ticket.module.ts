import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { EventTicket } from './ticket.entity';
import { TicketService } from './ticket.service';
import { TicketUserController } from './ticket-user.controller';
import { TicketAdminController } from './ticket-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventTicket, EventEntity])],
  controllers: [TicketUserController, TicketAdminController],
  providers: [TicketService]
})
export class TicketModule {}
