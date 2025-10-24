import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../events/event.entity';
import { EventTicket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsUserController } from './tickets-user.controller';
import { TicketsAdminController } from './tickets-admin.controller';
import { PlansService } from '../plans/plans.service';
import { EventsService } from '../events/events.service';
import { PlanEntity } from '../plans/plan.entity';
import { UploadImageService } from '../upload-image/upload-image.service';
import { UploadImage } from '../upload-image/upload-image.entity';
import { UploadIntent } from '../upload-image/upload-intent.entity';
import { DataSourceModule } from '../datasource/datasource.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTicket, EventEntity, PlanEntity, UploadImage, UploadIntent])
  ],
  controllers: [TicketsUserController, TicketsAdminController],
  providers: [TicketsService, PlansService, EventsService, UploadImageService]
})
export class TicketsModule {}
