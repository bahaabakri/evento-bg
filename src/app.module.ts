import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './events/event.entity';
import { UploadIntent } from './upload-image/upload-intent.entity';
import { UploadImage } from './upload-image/upload-image.entity';
import { UploadImageModule } from './upload-image/upload-image.module';

@Module({
  imports: [
    EventsModule,
    UploadImageModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [EventEntity, UploadIntent, UploadImage],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
