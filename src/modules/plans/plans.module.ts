import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './plan.entity';
import { PlansService } from './plans.service';
import { PlansUserController } from './plans-user.controller';
import { PlansAdminController } from './plans-admin.controller';
import { EventEntity } from '../events/event.entity';
import { EventsService } from '../events/events.service';
import { UploadImageService } from '../upload-image/upload-image.service';
import { UploadImage } from '../upload-image/upload-image.entity';
import { UploadIntent } from '../upload-image/upload-intent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, PlanEntity, UploadIntent, UploadImage])],
  controllers: [PlansUserController, PlansAdminController],
  providers: [EventsService, PlansService, UploadImageService]
})
export class PlansModule {}
