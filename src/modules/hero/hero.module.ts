import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hero } from './hero.entity';
import { UploadImageService } from '@/modules/upload-image/upload-image.service';
import { UploadIntent } from '@/modules/upload-image/upload-intent.entity';
import { UploadImage } from '@/modules/upload-image/upload-image.entity';
import { HeroAdminController } from './hero-admin.controller';
import { HeroUserController } from './hero-user.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Hero, UploadImage, UploadIntent])],
    controllers: [HeroAdminController, HeroUserController],
    providers:[HeroService, UploadImageService]
})
export class HeroModule {}
