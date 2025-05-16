import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hero } from './hero.entity';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { HeroController } from './hero.controller';
import { UploadIntent } from 'src/upload-image/upload-intent.entity';
import { UploadImage } from 'src/upload-image/upload-image.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Hero, UploadImage, UploadIntent])],
    controllers: [HeroController],
    providers:[HeroService, UploadImageService]
})
export class HeroModule {}
