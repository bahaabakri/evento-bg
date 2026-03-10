import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { UploadImageService } from '@/modules/upload-image/upload-image.service';
import { UploadImage } from '@/modules/upload-image/upload-image.entity';
import { UploadIntent } from '@/modules/upload-image/upload-intent.entity';
import { EventsUserController } from './events-user.controller';
import { EventsAdminController } from './events-admin.controller';
import { User } from '../users/user.entity';
import { FavoriteEventEntity } from './entities/favorite-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UploadImage, UploadIntent, User, FavoriteEventEntity])],
  controllers: [EventsAdminController, EventsUserController],
  providers: [EventsService, UploadImageService]
})
export class EventsModule {}
