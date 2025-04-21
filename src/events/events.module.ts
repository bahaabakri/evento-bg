import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { UploadImage } from 'src/upload-image/upload-image.entity';
import { UploadIntent } from 'src/upload-image/upload-intent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UploadImage, UploadIntent])],
  controllers: [EventsController],
  providers: [EventsService, UploadImageService]
})
export class EventsModule {}
