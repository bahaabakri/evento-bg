import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { UploadImage } from 'src/upload-image/upload-image.entity';
import { UploadIntent } from 'src/upload-image/upload-intent.entity';
import { EventsUserController } from './events-user.controller';
import { EventsAdminController } from './events-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UploadImage, UploadIntent])],
  controllers: [EventsAdminController, EventsUserController],
  providers: [EventsService, UploadImageService]
})
export class EventsModule {}
